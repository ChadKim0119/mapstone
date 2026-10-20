/* ================= 상태 ================= */
const STORE = 'mapstone.issueTracker.v2';
const MILESTONE_HREF = /\/(share|prototypes)\//.test(location.pathname) ? '../index.html' : 'index.html';
const clone = o => JSON.parse(JSON.stringify(o));
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
let doc;
const ui = { view: 'manage', rtab: 'summary', list: false, sel: null, itab: 'manage', q: '', fStatus: 'all', fGroup: 'all', fGap: '', hideResolved: false, compress: true, sort: { k: 'priority', dir: 1 }, assume: {}, collapsed: {}, scrollX: null, rScrollX: null, revealNow: false, flash: null, editEvent: null };
const undoStack = [];
let savedAt = '', storageError = '';
let sampleFn = null, downloadsFn = null;

function load() {
  try {
    const raw = localStorage.getItem(STORE);
    doc = raw ? normalizeDoc(JSON.parse(raw)) : sampleDoc();
    const u = JSON.parse(localStorage.getItem(STORE + '.ui') || 'null');
    if (u) ['view', 'rtab', 'list', 'sel', 'itab', 'hideResolved', 'compress', 'sort', 'collapsed'].forEach(k => { if (u[k] !== undefined) ui[k] = u[k]; });
    savedAt = doc.updatedAt || '';
  } catch (e) { doc = sampleDoc(); storageError = '저장된 문서를 읽지 못해 예제를 열었습니다. 파일로 저장해 둔 문서가 있으면 이슈 텍스트 입력에서 불러오세요.'; }
  // NOW는 직접 옮기지 않았다면 열 때마다 오늘로 따라온다 (보고 기준일과 별개)
  if (!doc.nowManual) doc.now = todayISO();
  if (!doc.issues.some(i => i.id === ui.sel)) ui.sel = (sorted(doc.issues)[0] || {}).id || null;
}
let saveTimer;
function persist(now) {
  clearTimeout(saveTimer);
  const run = () => {
    if (document.prerendering) return; // 미리 준비 중에는 저장하지 않음(실제로 열 때 다시 읽음)
    try { doc.updatedAt = new Date().toISOString(); localStorage.setItem(STORE, JSON.stringify(doc)); savedAt = doc.updatedAt; storageError = ''; }
    catch (e) { storageError = '브라우저 저장 공간을 쓸 수 없습니다. 파일 저장으로 현재 내용을 보관하세요.'; }
    persistUI(); paintSave();
  };
  if (now) run(); else saveTimer = setTimeout(run, 300);
}
function persistUI() { if (document.prerendering) return; try { localStorage.setItem(STORE + '.ui', JSON.stringify({ view: ui.view, rtab: ui.rtab, list: ui.list, sel: ui.sel, itab: ui.itab, hideResolved: ui.hideResolved, compress: ui.compress, sort: ui.sort, collapsed: ui.collapsed })); } catch (e) { } }
window.addEventListener('pagehide', () => persist(true));

const issueById = id => doc.issues.find(i => i.id === id);
const sorted = list => [...list].sort((a, b) => a.priority - b.priority || a.title.localeCompare(b.title));
const groupColor = g => GROUP_COLORS[Math.max(0, doc.groupOrder.indexOf(g)) % GROUP_COLORS.length];
const openReq = i => i.requests.filter(q => q.state !== 'done').length;
const daysSince = iso => iso ? Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / 864e5)) : null;
const checkState = i => !i.checkDate ? 'none' : i.checkDate < doc.now ? 'late' : diffD(doc.now, i.checkDate) <= 2 ? 'soon' : 'ok';
const planDue = e => e.kind === 'plan' && e.date && e.date < doc.now;
const nowLag = () => diffD(doc.asOf, doc.now);
const lagText = () => { const n = nowLag(); return n > 0 ? `보고 후 ${n}일 경과` : n < 0 ? `보고 ${-n}일 전` : ''; };
/* NOW 이동: 논의 시점만 바꾸며 실행 취소 이력·예제 표시에는 넣지 않는다 */
function setNow(date, manual) {
  if (!isDate(date)) return;
  const today = todayISO(); manual = manual && date !== today;
  if (doc.now === date && doc.nowManual === manual) return;
  doc.now = date; doc.nowManual = manual; ui.revealNow = true; persist();
  if (ui.view === 'manage') refresh(['dochead', 'strip', 'canvas', 'insp', 'blocks']); else render();
}

function snapshot(label) { undoStack.push({ label, doc: clone(doc), sel: ui.sel, itab: ui.itab }); if (undoStack.length > 30) undoStack.shift(); }
function undo() {
  const s = undoStack.pop(); if (!s) return;
  doc = s.doc; ui.sel = s.sel; ui.itab = s.itab || ui.itab; if (!issueById(ui.sel)) ui.sel = (sorted(doc.issues)[0] || {}).id || null;
  persist(); render(); toast(`되돌렸습니다: ${s.label}`);
}
/* 변경 적용: parts = 다시 그릴 영역 */
function mutate(fn, o = {}) {
  if (o.undo) snapshot(o.undo);
  fn(doc);
  if (o.touch) { const i = issueById(o.touch); if (i) i.updatedAt = new Date().toISOString(); }
  doc.example = false;
  persist();
  if (o.parts) refresh(o.parts); else render();
  if (o.toast) toast(o.toast, o.undo ? { label: '되돌리기', fn: undo } : null);
}
let refreshTimer, pendingParts = new Set();
function refreshSoon(parts) { parts.forEach(p => pendingParts.add(p)); clearTimeout(refreshTimer); refreshTimer = setTimeout(() => { const p = [...pendingParts]; pendingParts.clear(); refresh(p); }, 140); }

/* ================= 필터 ================= */
function visibleIssues() {
  const q = ui.q.trim().toLowerCase();
  return sorted(doc.issues).filter(i =>
    (ui.fStatus === 'all' || i.status === ui.fStatus) &&
    (ui.fGroup === 'all' || i.group === ui.fGroup) &&
    (!ui.hideResolved || i.status !== 'resolved') &&
    (!ui.fGap || (ui.fGap === 'owner' && !i.owner.trim()) || (ui.fGap === 'check' && !i.checkDate) || (ui.fGap === 'late' && checkState(i) === 'late') || (ui.fGap === 'req' && openReq(i) > 0)) &&
    (!q || [i.title, i.area, i.group, i.owner, i.summary, i.gate, i.key, ...i.events.map(e => e.text), ...i.actions.map(a => a.text), ...i.requests.map(r => r.text + ' ' + r.party)].join(' ').toLowerCase().includes(q)));
}
const filtersOn = () => ui.q || ui.fStatus !== 'all' || ui.fGroup !== 'all' || ui.fGap || ui.hideResolved;

/* ================= 아이콘 ================= */
const I = {
  logo: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 3 7.5 12 12l9-4.5L12 3Z"/><path d="m3 12 9 4.5 9-4.5"/><path d="m3 16.5 9 4.5 9-4.5"/></svg>',
  search: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5E7694" stroke-width="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  plus: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  text: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 11h16M4 16h9M4 21h6"/></svg>',
  save: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/></svg>',
  undo: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/></svg>',
  lock: '<svg width="11" height="12" viewBox="0 0 11 12" aria-hidden="true" style="flex:none"><rect x="1" y="5" width="9" height="6.5" rx="1.5" fill="currentColor"/><path d="M3 5V3.6a2.5 2.5 0 0 1 5 0V5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  x: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  chev: '<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  sortI: '<svg width="8" height="10" viewBox="0 0 8 10" aria-hidden="true"><path d="M4 1 1 4h6zM4 9 1 6h6z" fill="currentColor"/></svg>',
  diamond: (c = 'currentColor', s = 12) => `<svg width="${s}" height="${s}" viewBox="0 0 12 12" aria-hidden="true" style="flex:none"><path d="M6 .8 11.2 6 6 11.2.8 6Z" fill="${c}"/></svg>`
};
const badge = (status, sm) => `<span class="badge ${sm ? 'sm ' : ''}${STATUS[status].cls}">${STATUS[status].label}</span>`;

/* ================= 렌더: 셸 ================= */
function render() {
  document.title = 'MapStone 이슈관리 모드';
  $('#app').innerHTML = `<header class="appbar"><div class="appbar-in" id="appbar"></div></header><main class="page" id="page"></main>`;
  paintAppbar();
  const p = $('#page');
  if (ui.view === 'manage') {
    p.innerHTML = `<section class="dochead" id="dochead"></section>
      ${storageError ? `<div class="err" role="alert">${esc(storageError)}</div>` : ''}
      <section class="strip" id="strip" aria-label="상태 요약"></section>
      <section class="ws-bar" id="wsbar" aria-label="이슈 보기 도구"></section>
      <div class="ws"><section class="card canvas" id="canvas" aria-label="이슈 타임라인"></section><aside class="card insp" id="insp" aria-label="선택한 이슈 관리"></aside></div>
      <section class="blocks" id="blocks"></section>${footHTML()}`;
    refresh(['dochead', 'strip', 'wsbar', 'canvas', 'insp', 'blocks']);
  } else {
    p.innerHTML = reportHTML();
    bindReport();
  }
  bindFoot();
}
function refresh(parts) {
  if (ui.view !== 'manage') { if (parts.length) render(); return; }
  parts.forEach(k => {
    if (k === 'insphead') { const h = $('#insp-head'); if (h) h.innerHTML = inspHeadHTML(issueById(ui.sel)); return; }
    const el = $('#' + k); if (!el) return;
    if (k === 'dochead') { el.innerHTML = docheadHTML(); bindDochead(); }
    if (k === 'strip') { el.innerHTML = stripHTML(true); bindStrip(el); }
    if (k === 'wsbar') { el.innerHTML = wsbarHTML(); bindWsbar(); }
    if (k === 'canvas') { if (ui.list) { el.innerHTML = tableHTML(); bindTable(el); } else drawCanvas(el, false); }
    if (k === 'insp') {
      const ae = document.activeElement, aid = ae && el.contains(ae) ? ae.id : '', body = $('#insp-body'), st = body ? body.scrollTop : 0, sameIssue = el.dataset.issue === ui.sel && el.dataset.tab === ui.itab;
      el.innerHTML = inspHTML(); el.dataset.issue = ui.sel || ''; el.dataset.tab = ui.itab; bindInsp();
      if (sameIssue) { const nb = $('#insp-body'); if (nb) nb.scrollTop = st; if (aid) { const n = document.getElementById(aid); if (n) n.focus({ preventScroll: true }); } }
    }
    if (k === 'blocks') { el.innerHTML = blocksHTML(true); bindBlocks(el); }
  });
}
function paintAppbar() {
  const r = ui.view === 'report';
  $('#appbar').innerHTML = `<span class="brand">MapStone${typeof APP_VER === 'string' ? `<span class="ver">${esc(APP_VER)}</span>` : ''}</span>
    <nav class="seg mode-switch" aria-label="MapStone 모드"><a id="m-ms" href="${MILESTONE_HREF}" title="마일스톤 모드"><span class="mode-full">마일스톤 모드</span><span class="mode-short">마일스톤</span></a><span aria-current="page" title="이슈관리 모드"><span class="mode-full">이슈관리 모드</span><span class="mode-short">이슈관리</span></span></nav>
    <span class="grow"></span>
    <span class="save-state" id="save-state"></span>
    <button class="btn" id="b-save">${I.save}파일 저장</button>
    <div class="seg" role="group" aria-label="화면"><button id="v-m" aria-pressed="${!r}">관리 화면</button><button id="v-r" aria-pressed="${r}">보고 화면</button></div>
    <button class="btn primary" id="b-import">${I.text}이슈 텍스트 입력</button>`;
  paintSave();
  $('#m-ms').onclick = e => { if (window.top !== window) { e.preventDefault(); toast('마일스톤 모드는 MapStone 앱에서 열립니다.'); } else persist(true); };
  $('#v-m').onclick = () => { if (ui.view !== 'manage') { ui.view = 'manage'; persistUI(); render(); window.scrollTo(0, 0); } };
  $('#v-r').onclick = () => { if (ui.view !== 'report') { ui.view = 'report'; persistUI(); render(); window.scrollTo(0, 0); } };
  $('#b-import').onclick = () => openImport();
  $('#b-save').onclick = saveFile;
}
function paintSave() {
  const el = $('#save-state'); if (!el) return;
  if (storageError) { el.innerHTML = `<i class="dot" style="background:var(--red)"></i>저장 안 됨`; return; }
  el.innerHTML = savedAt ? `<i class="dot"></i>이 브라우저에 저장 ${new Date(savedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}` : `<i class="dot" style="background:var(--slate3)"></i>예제 문서`;
}
function footHTML() {
  return `<footer class="foot"><span>MapStone${typeof APP_VER === 'string' ? ' ' + esc(APP_VER) : ''} · 이슈관리 모드 · QA 수행 가능 분류는 실제 Pass/Fail과 별도로 관리합니다</span>
    <span class="foot-r"><button class="link" id="f-src">입력 원문 보기</button><button class="link" id="f-reset">예제로 초기화</button></span></footer>`;
}
function bindFoot() {
  $('#f-src').onclick = () => openModal('입력 원문', `<pre class="full">${esc(doc.source || '입력 원문이 없습니다.')}</pre>`, { narrow: false });
  $('#f-reset').onclick = () => { snapshot('예제로 초기화'); doc = sampleDoc(); ui.sel = sorted(doc.issues)[0].id; ui.assume = {}; persist(); render(); toast('예제 문서로 초기화했습니다', { label: '되돌리기', fn: undo }); };
}

/* ================= 문서 머리 / 상태 띠 ================= */
function docheadHTML() {
  return `<div class="dochead-l"><div class="doc-eyebrow"><span>MANAGE · 이슈관리</span><span>${doc.issues.length}개 이슈 · 미해결 ${doc.issues.filter(i => i.status !== 'resolved').length}개</span>${lagText() ? `<span class="lag${nowLag() > 0 ? '' : ' fwd'}" title="보고 기준일 ${doc.asOf} → NOW ${doc.now}">${lagText()}</span>` : ''}</div>
    <label class="sr" for="doc-title">문서 제목</label><input class="doc-title" id="doc-title" value="${esc(doc.title)}" maxlength="200">
    <p class="doc-sub">${esc(doc.subtitle || '이력을 연결하고, 차단 조건과 다음 점검을 관리하세요.')}</p></div>
    <div class="dochead-r">${undoStack.length ? `<button class="btn" id="b-undo">${I.undo}되돌리기</button>` : ''}<label class="asof" for="asof" title="원문 보고서가 작성된 날짜. 금일·오전 같은 표현을 이 날짜로 해석합니다.">보고 기준일<input class="input" type="date" id="asof" value="${doc.asOf}"></label>
      <div class="nowctl${doc.nowManual ? ' moved' : ''}"><label class="asof" for="now-in" title="논의 중인 시점. 타임라인의 NOW를 드래그하거나 더블클릭하면 오늘로 돌아갑니다.">NOW<input class="input" type="date" id="now-in" value="${doc.now}"></label>${doc.nowManual ? `<button class="btn sm" id="b-now-today" title="NOW를 오늘(${todayISO()})로 이동">오늘로</button>` : ''}</div></div>`;
}
function bindDochead() {
  $('#doc-title').oninput = e => { doc.title = e.target.value; doc.example = false; persist(); };
  $('#asof').onchange = e => { if (isDate(e.target.value)) mutate(d => { d.asOf = e.target.value; }, { parts: ['strip', 'canvas', 'blocks'] }); else e.target.value = doc.asOf; };
  $('#now-in').onchange = e => { if (isDate(e.target.value)) setNow(e.target.value, true); else e.target.value = doc.now; };
  const nt = $('#b-now-today'); if (nt) nt.onclick = () => setNow(todayISO(), false);
  const u = $('#b-undo'); if (u) u.onclick = undo;
}
function verdict() {
  const c = s => doc.issues.filter(i => i.status === s).length;
  if (c('blocked')) return { text: `선행 조건 미충족 · 차단 ${c('blocked')}건 해소 필요`, tone: 'red' };
  if (c('progress') || c('pending')) return { text: '선행 조건 해소 진행 중', tone: 'amber' };
  return { text: doc.issues.length ? '선행 조건 해소 · 진행 가능' : '등록된 이슈 없음', tone: 'green' };
}
function statusPills(light) {
  return Object.keys(STATUS).map(k => [k, doc.issues.filter(i => i.status === k).length]).filter(([, n]) => n).map(([k, n]) => `<span class="badge${!light && k === 'blocked' ? ' hot' : ''}">${STATUS[k].label} ${n}</span>`).join('');
}
function kpiHTML() {
  const t = metricTotals(doc.metrics);
  const by = k => doc.metrics.filter(m => m[k]).map(m => `${m.label} ${m[k]}`).join(' · ');
  if (!doc.metrics.length) return `<div class="card kpis"><div class="kpi" style="grid-column:1/-1"><span class="lab">QA 수행 가능 분류</span><span class="sub">원문에 TC 분류표가 없습니다. 하단 QA 블록에서 직접 추가할 수 있습니다.</span></div></div>`;
  return `<div class="card kpis">
    <div class="kpi"><span class="lab">전체 TC</span><span class="val">${t.total}</span><span class="sub">QA 사전 분류 기준</span></div>
    <div class="kpi red"><span class="lab">수행 불가 (N/T)</span><span class="val">${t.blocked}<em>${pctS(t.blocked, t.total)}</em></span><span class="sub">${esc(by('blocked')) || '—'}</span></div>
    <div class="kpi amber"><span class="lab">제한적 검증</span><span class="val">${t.limited}<em>${pctS(t.limited, t.total)}</em></span><span class="sub">${esc(by('limited')) || '—'}</span></div>
    <div class="kpi"><span class="lab">기타 TC</span><span class="val">${t.other}<em class="muted">${pctS(t.other, t.total)}</em></span><span class="sub">별도 제한 미분류 · 가능 확정 아님</span></div>
    <div class="kpi-foot"><span>수행 가능 분류 ≠ Pass/Fail</span><span class="meter"><i style="width:${pct(t.blocked, t.total)}%;background:var(--red)"></i><i style="width:${pct(t.limited, t.total)}%;background:var(--amberline)"></i><i style="width:${pct(t.other, t.total)}%;background:var(--blue3)"></i></span><span>이슈가 해결돼도 QA 재분류 전까지 건수는 바뀌지 않습니다</span></div></div>`;
}
function stepsHTML(i, interactive) {
  return `<div class="steps">${i.steps.map((s, n) => `<${interactive ? 'button' : 'span'} class="step st-${s[1]}" ${interactive ? `data-step="${n}" data-issue="${i.id}" title="${esc(s[0])} · ${STEP[s[1]]} (눌러서 변경)"` : `title="${esc(s[0])} · ${STEP[s[1]]}"`}>${s[1] === 'done' ? '✓' : s[1] === 'fail' ? '✕' : ''}<span>${esc(s[0])}</span></${interactive ? 'button' : 'span'}>`).join('')}</div>`;
}
function gatesHTML(interactive) {
  const g = sorted(doc.issues).filter(i => i.steps.length).slice(0, 3);
  return `<div class="card gates"><div class="gates-h"><h3>핵심 게이트 진행</h3><span class="caption">${interactive ? '단계를 눌러 상태 변경' : ''}</span></div>
    ${g.length ? g.map(i => `<div class="gate-row" data-open="${i.id}" role="button" tabindex="0"><div class="t">${I.diamond('var(--navy)')}<span>P${i.priority} · ${esc(i.title)}</span>${badge(i.status, true)}</div>${stepsHTML(i, interactive)}</div>`).join('') : `<p class="caption">이슈 인스펙터에서 게이트 단계를 추가하면 여기서 진행을 추적합니다.</p>`}</div>`;
}
function stripHTML(interactive) {
  const v = verdict();
  return `<div class="card verdict"><span class="lab">NOW ${dl(doc.now)} (${wd(doc.now)}) · ${nowLag() ? `보고 ${dl(doc.asOf)} (${nowLag() > 0 ? '+' : ''}${nowLag()}일)` : '보고 기준일 동일'} · 이슈 ${doc.issues.length}건</span><span class="big">${esc(v.text)}</span><span class="pills">${statusPills(false)}</span></div>${kpiHTML()}${gatesHTML(interactive)}`;
}
function bindStrip(el) {
  $$('[data-step]', el).forEach(b => b.onclick = e => {
    e.stopPropagation();
    const i = issueById(b.dataset.issue), s = i.steps[+b.dataset.step], order = ['todo', 'current', 'done', 'fail'];
    const nx = order[(order.indexOf(s[1]) + 1) % 4];
    mutate(() => { s[1] = nx; i.notes.push({ at: new Date().toISOString(), text: `게이트 단계 '${s[0]}' → ${STEP[nx]}`, sys: true }); }, { parts: ['strip', 'canvas', 'insp'], touch: i.id });
  });
  $$('[data-open]', el).forEach(r => { const go = () => select(r.dataset.open, 'manage'); r.onclick = go; r.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }; });
}

/* ================= 작업 도구 ================= */
function wsbarHTML() {
  const vis = visibleIssues();
  const gaps = { owner: '담당 미정', check: '점검일 미정', late: '점검일 경과', req: '회신 대기' };
  return `<div class="ws-bar-l"><h2>이슈 현황 <span class="count">${doc.issues.length}</span></h2>
      <div class="seg sm" role="group" aria-label="보기"><button id="lv-t" aria-pressed="${!ui.list}">타임라인</button><button id="lv-l" aria-pressed="${ui.list}">표</button></div>
      <button class="toggle" id="t-comp" aria-pressed="${ui.compress}" ${ui.list ? 'disabled style="opacity:.45"' : ''}><span class="sw"></span>빈 기간 접기</button>
      ${filtersOn() ? `<span class="caption">${vis.length}건 표시</span><button class="link" id="f-clear">필터 해제</button>` : ''}</div>
    <div class="ws-bar-r">
      <div class="search">${I.search}<label class="sr" for="q">이슈 검색</label><input class="input" id="q" placeholder="이슈·담당·이력 검색" value="${esc(ui.q)}"></div>
      <label class="sr" for="f-st">상태</label><select class="select" id="f-st" style="width:132px"><option value="all">모든 상태</option>${Object.entries(STATUS).map(([k, s]) => `<option value="${k}" ${ui.fStatus === k ? 'selected' : ''}>${s.label} (${doc.issues.filter(i => i.status === k).length})</option>`).join('')}</select>
      <label class="sr" for="f-gr">영역</label><select class="select" id="f-gr" style="width:140px"><option value="all">모든 영역</option>${doc.groupOrder.map(g => `<option value="${esc(g)}" ${ui.fGroup === g ? 'selected' : ''}>${esc(g)}</option>`).join('')}</select>
      <label class="sr" for="f-gap">관리 공백</label><select class="select" id="f-gap" style="width:136px"><option value="">관리 공백 전체</option>${Object.entries(gaps).map(([k, l]) => `<option value="${k}" ${ui.fGap === k ? 'selected' : ''}>${l}</option>`).join('')}</select>
      <button class="toggle" id="t-res" aria-pressed="${ui.hideResolved}"><span class="sw"></span>해결 숨김</button>
      <button class="btn" id="b-add">${I.plus}이슈 추가</button></div>`;
}
function bindWsbar() {
  $('#lv-t').onclick = () => { ui.list = false; persistUI(); refresh(['wsbar', 'canvas']); };
  $('#lv-l').onclick = () => { ui.list = true; persistUI(); refresh(['wsbar', 'canvas']); };
  $('#t-comp').onclick = () => { ui.compress = !ui.compress; ui.scrollX = null; persistUI(); refresh(['wsbar', 'canvas']); };
  $('#t-res').onclick = () => { ui.hideResolved = !ui.hideResolved; persistUI(); refresh(['wsbar', 'canvas']); };
  const q = $('#q'); let qt;
  q.oninput = () => { clearTimeout(qt); qt = setTimeout(() => { ui.q = q.value; refresh(['canvas']); const c = $('#wsbar .caption'); refreshWsbarKeepFocus(); }, 160); };
  $('#f-st').onchange = e => { ui.fStatus = e.target.value; refresh(['wsbar', 'canvas']); };
  $('#f-gr').onchange = e => { ui.fGroup = e.target.value; refresh(['wsbar', 'canvas']); };
  $('#f-gap').onchange = e => { ui.fGap = e.target.value; refresh(['wsbar', 'canvas']); };
  const fc = $('#f-clear'); if (fc) fc.onclick = () => { ui.q = ''; ui.fStatus = 'all'; ui.fGroup = 'all'; ui.fGap = ''; ui.hideResolved = false; refresh(['wsbar', 'canvas']); };
  $('#b-add').onclick = addIssue;
}
function refreshWsbarKeepFocus() {
  const q = $('#q'), pos = q ? q.selectionStart : 0;
  refresh(['wsbar']);
  const nq = $('#q'); if (nq) { nq.focus(); try { nq.setSelectionRange(pos, pos); } catch (e) { } }
}
function addIssue() {
  const g = ui.fGroup !== 'all' ? ui.fGroup : (issueById(ui.sel) || {}).group || '미분류';
  const it = normalizeDoc({ issues: [{ title: '새 이슈', group: g, area: g, priority: 5, status: 'pending', actions: [] }] }).issues[0];
  mutate(d => { d.issues.push(it); if (!d.groupOrder.includes(g)) d.groupOrder.push(g); }, { undo: '이슈 추가' });
  ui.q = ''; ui.fStatus = 'all'; ui.fGap = ''; ui.hideResolved = false;
  select(it.id, 'manage');
  setTimeout(() => { const t = $('#i-title'); if (t) { t.focus(); t.select(); } }, 30);
  toast('새 이슈를 추가했습니다. 제목과 담당을 입력하세요.', { label: '되돌리기', fn: undo });
}
function select(id, tab, flash) {
  ui.sel = id; if (tab) ui.itab = tab; ui.flash = flash || null; ui.editEvent = null; persistUI();
  if (ui.view !== 'manage') { ui.view = 'manage'; ui.q = ''; ui.fStatus = 'all'; ui.fGroup = 'all'; ui.fGap = ''; render(); window.scrollTo(0, 0); return; }
  refresh(['canvas', 'insp']);
  if (flash) setTimeout(() => { const h = $(`[data-he="${flash}"]`); if (h) h.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 30);
}

/* ================= 캔버스 ================= */
function buildAxis(issues, compress) {
  const asOf = doc.now, keys = new Set([asOf, doc.asOf]);
  issues.forEach(i => {
    i.events.forEach(e => e.date && keys.add(e.date));
    if (i.constraint && i.constraint.start && i.status !== 'resolved') keys.add(i.constraint.start);
    if (i.checkDate && Math.abs(diffD(asOf, i.checkDate)) <= 45) keys.add(i.checkDate);
  });
  const ks = [...keys].sort();
  const start = [ks[0], addD(asOf, -2)].sort()[0];
  const end = [ks[ks.length - 1], addD(asOf, 3)].sort().pop();
  const days = []; for (let d = start; d <= end; d = addD(d, 1)) days.push(d);
  if (!compress) return days.map(date => ({ t: 'd', date }));
  const keep = new Set(ks); for (let k = -1; k <= 3; k++) keep.add(addD(asOf, k));
  // 보고 기준일 ~ NOW 사이(2주 이내)는 접지 않아 경과한 날짜를 그대로 보여준다
  const [ra, rb] = [doc.asOf, doc.now].sort(); if (diffD(ra, rb) <= 14) for (let d = ra; d <= rb; d = addD(d, 1)) keep.add(d);
  const cols = []; let run = [];
  const flush = () => { if (run.length >= 2) cols.push({ t: 'g', from: run[0], to: run[run.length - 1], n: run.length }); else run.forEach(date => cols.push({ t: 'd', date })); run = []; };
  days.forEach(d => { if (keep.has(d)) { flush(); cols.push({ t: 'd', date: d }); } else run.push(d); });
  flush();
  return cols;
}
function drawCanvas(host, ro) {
  const issues = ro ? sorted(doc.issues) : visibleIssues();
  const groups = doc.groupOrder.filter(g => issues.some(i => i.group === g));
  const cols = buildAxis(issues.length ? issues : doc.issues, ui.compress);
  const narrow = window.innerWidth < 760, LW = narrow ? 168 : 224, RW = narrow ? 0 : (host.clientWidth < 1060 ? 236 : 256), GAPW = 30;
  host.innerHTML = `<div class="canvas-top"><div class="legend">
      <span><i style="background:var(--blue)"></i>확인 이력</span><span><i style="background:var(--red)"></i>실패·오류</span><span><i style="background:var(--green)"></i>정상</span><span><i style="background:var(--amberline)"></i>정정·지연</span><span><i style="background:var(--white);border:1.5px dashed var(--slate)"></i>예정</span>
      <span><i style="background:var(--red1);border:1px solid var(--red2);width:16px"></i>지속 제약</span><span style="color:var(--violet)">${I.lock}선행 조건</span></div>
      <span class="caption">${ui.compress ? '날짜 간격 비례 · 빈 기간은 +N일로 접음' : '날짜 간격 비례'} · 오른쪽은 다음 단계</span></div>
    <div class="tl" style="--lw:${LW}px;--rw:${RW}px"><div class="tl-col tl-l"></div><div class="tl-col tl-mid"><div class="tl-midin"></div></div><div class="tl-col tl-r"></div></div>`;
  const L = $('.tl-l', host), M = $('.tl-mid', host), MI = $('.tl-midin', host), R = $('.tl-r', host);
  if (!issues.length) {
    L.innerHTML = `<div class="tl-head">우선순위 · 이슈</div>`; R.innerHTML = `<div class="tl-head">다음 단계 · 검증 게이트</div>`;
    MI.innerHTML = `<div class="tl-head"></div><div class="empty"><b>${doc.issues.length ? '조건에 맞는 이슈가 없습니다' : '아직 이슈가 없습니다'}</b>${doc.issues.length ? '검색어나 필터를 바꾸거나 필터를 해제하세요.' : '이슈 텍스트 입력으로 원문을 정리하거나 이슈를 추가하세요.'}</div>`;
    return;
  }
  // widths
  const avail = Math.max(320, M.clientWidth);
  const nd = cols.filter(c => c.t === 'd').length, ng = cols.length - nd;
  const DAYW = Math.max(narrow ? 44 : 30, Math.min(120, Math.floor((avail - ng * GAPW) / Math.max(1, nd))));
  let x = 0; cols.forEach(c => { c.x = x; c.w = c.t === 'd' ? DAYW : GAPW; x += c.w; });
  const MW = Math.max(x, avail);
  const colOf = d => cols.find(c => c.t === 'd' ? c.date === d : d >= c.from && d <= c.to) || (d < cols[0].date ? cols[0] : cols[cols.length - 1]);
  const xL = d => colOf(d).x, xC = d => { const c = colOf(d); return c.x + c.w / 2; }, xR = d => { const c = colOf(d); return c.x + c.w; };
  MI.style.width = MW + 'px';
  // header
  let head = '';
  let lastMonth = '';
  // NOW는 접힌 구간 안에서도 날짜 비율로 위치한다
  const xAt = d => { const c = colOf(d); return c.t === 'd' ? c.x + c.w / 2 : c.x + (Math.max(0, Math.min(c.n - 1, diffD(c.from, d))) + 0.5) / c.n * c.w; };
  const dateAt = px => { const c = cols.find(c => px >= c.x && px < c.x + c.w) || (px < 0 ? cols[0] : cols[cols.length - 1]); return c.t === 'd' ? c.date : addD(c.from, Math.max(0, Math.min(c.n - 1, Math.floor((px - c.x) / c.w * c.n)))); };
  const pillW = 80, todayX = xAt(doc.now), repX = xAt(doc.asOf), showRep = doc.asOf !== doc.now && Math.abs(repX - todayX) >= pillW + 4;
  const nowLabel = d => `NOW<small>${dl(d)}</small>`;
  const nowPill = pos => `<div class="tl-now ${pos}" data-now="${pos}" role="slider" tabindex="0" aria-label="NOW 날짜" aria-valuetext="${doc.now}" title="NOW ${doc.now} · 드래그로 이동 · 더블클릭(Enter)으로 오늘 · ←/→ 하루, Shift 7일" style="left:${todayX}px"><b>${nowLabel(doc.now)}</b></div>`;
  cols.forEach(c => {
    if (c.t === 'g') { head += `<div class="tl-day gap" style="left:${c.x}px;width:${c.w}px" title="${dl(c.from)}–${dl(c.to)} (${c.n}일)">⋯<small>+${c.n}일</small></div>`; return; }
    const m = c.date.slice(0, 7), dd = parseD(c.date), we = [0, 6].includes(dd.getUTCDay());
    if (m !== lastMonth) { head += `<div class="tl-month" style="left:${c.x + 3}px">${+c.date.slice(5, 7)}월</div>`; lastMonth = m; }
    if (c.date === doc.now || Math.abs(c.x + c.w / 2 - todayX) < pillW / 2 + 9 || (showRep && Math.abs(c.x + c.w / 2 - repX) < pillW / 2 + 4)) return;
    head += `<div class="tl-day${we ? ' we' : ''}" style="left:${c.x}px;width:${c.w}px;padding-top:12px">${+c.date.slice(8)}<small>${wd(c.date)}</small></div>`;
  });
  if (showRep) head += `<div class="tl-rep" style="left:${repX}px" title="보고 기준일 ${doc.asOf}">보고 ${dl(doc.asOf)}</div>`;
  head += nowPill('top');
  // background layer
  let bg = '';
  cols.forEach(c => {
    if (c.t === 'g') bg += `<div style="position:absolute;left:${c.x}px;width:${c.w}px;top:0;bottom:0;background:repeating-linear-gradient(135deg,#F5F8FD 0 6px,#E9F0FA 6px 12px)"></div>`;
    else { const w = parseD(c.date).getUTCDay(); if (w === 0 || w === 6) bg += `<div style="position:absolute;left:${c.x}px;width:${c.w}px;top:0;bottom:0;background:rgb(210 226 247/.28)"></div>`; bg += `<div style="position:absolute;left:${c.x}px;width:1px;top:0;bottom:0;background:${w === 1 ? 'var(--blue2)' : 'rgb(210 226 247/.55)'}"></div>`; }
  });
  if (doc.asOf !== doc.now) bg += `<div class="tl-repline" style="left:${repX - 1}px"></div>`;
  bg += `<div class="tl-nowline" style="left:${todayX - 1}px"></div>`;
  // rows
  let lh = `<div class="tl-head">우선순위 · 이슈</div>`, mh = `<div class="tl-head">${head}</div><div class="tl-bg" style="width:${MW}px">${bg}</div>`, rh = `<div class="tl-head">다음 단계 · 검증 게이트<small>완료 조건 · 점검일 · 조치 · 선행 조건</small></div>`;
  groups.forEach(g => {
    const gi = issues.filter(i => i.group === g), col = !!ui.collapsed[g];
    const gh = `<div class="tl-grp" data-grp="${esc(g)}"`;
    lh += `${gh} role="button" tabindex="0" aria-expanded="${!col}" style="cursor:pointer"><span style="transform:rotate(${col ? -90 : 0}deg);display:inline-grid;transition:transform .12s">${I.chev}</span><i class="dot" style="background:${groupColor(g)}"></i>${esc(g)}<span class="count">${gi.length}</span></div>`;
    mh += `${gh}></div>`; rh += `${gh}></div>`;
    if (col) return;
    gi.forEach(i => {
      const sel = i.id === ui.sel ? ' sel' : '';
      lh += `<button class="tl-row${sel}" data-row="${i.id}" ${ro ? 'tabindex="-1"' : ''} aria-label="P${i.priority} ${esc(i.title)}"><span class="eyebrow"><span class="pr">P${i.priority}</span><span>·</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(i.area)}</span></span><span class="tt">${esc(i.title)}</span><span class="meta">${badge(i.status, true)}<span class="own${i.owner.trim() ? '' : ' none'}">${esc(i.owner.trim() || '담당 확인 필요')}</span></span>${narrow ? `<span class="meta">${(() => { const cs = checkState(i); return cs === 'none' ? '<span class="chip warn">점검일 미정</span>' : cs === 'late' ? `<span class="chip bad">경과 ${dl(i.checkDate)}</span>` : `<span class="chip">점검 ${dl(i.checkDate)}</span>`; })()}${i.actions.length ? `<span class="prog">조치 ${i.actions.filter(a => a.done).length}/${i.actions.length}</span>` : ''}</span>` : ''}</button>`;
      mh += `<div class="tl-row${sel}" data-row="${i.id}"></div>`;
      rh += `<div class="tl-row${sel}" data-row="${i.id}">${rightCell(i, ro)}</div>`;
    });
  });
  lh += `<div class="tl-foot"><span>NOW 드래그 · 더블클릭 오늘</span></div>`; mh += `<div class="tl-foot">${nowPill('bottom')}</div>`; rh += `<div class="tl-foot"></div>`;
  L.innerHTML = lh; MI.insertAdjacentHTML('beforeend', mh); R.innerHTML = rh;
  // fill middle rows & pack
  const rowH = {};
  issues.forEach(i => {
    const m = $(`.tl-row[data-row="${i.id}"]`, MI); if (!m) return;
    const items = [];
    if (i.constraint && i.constraint.text && i.status !== 'resolved') {
      const left = i.constraint.start ? xL(i.constraint.start) + 2 : 0;
      const el = document.createElement('div');
      el.className = `band${i.constraint.tone === 'amber' ? ' warn' : ''}${i.constraint.start ? '' : ' open-l'}`;
      el.dataset.band = i.id; el.title = `${i.constraint.text} · ${i.constraint.start ? dl(i.constraint.start) + '부터' : '시작일 미상'} · 해소 미정`;
      el.style.left = left + 'px'; el.style.width = (MW - left) + 'px';
      el.innerHTML = `<span class="bl"><span class="bt">${esc(i.constraint.text)}</span><span class="bs">${i.constraint.start ? dl(i.constraint.start) + '~' : '시작일 미상 ~'} 해소 미정</span></span>`;
      m.appendChild(el); items.push({ el, x: left, w: MW - left, band: true });
    }
    const CW = Math.max(116, Math.min(150, Math.round(DAYW * 3.4)));
    i.events.filter(e => e.date).forEach(e => {
      const el = document.createElement('button');
      const k = KIND[e.kind];
      const due = planDue(e);
      el.className = `ev${e.kind === 'plan' ? ' plan' : ''}${due ? ' due' : ''}${e.corrected ? ' corr' : ''}${ui.flash === e.id ? ' flash' : ''}`;
      el.dataset.ev = e.id; el.dataset.issue = i.id;
      let left = xL(e.date) + 2; if (left + CW > MW - 2) left = Math.max(0, MW - 2 - CW);
      el.style.left = left + 'px'; el.style.width = CW + 'px'; el.style.borderLeftColor = k.color;
      el.title = `${e.date}${e.flag === '*' ? ' (날짜 재확인)' : ''}${due ? ' · 예정일 지남, 결과 확인 필요' : ''} · ${e.text}`;
      el.innerHTML = `<span class="pin" style="left:${Math.max(-4, xC(e.date) - left - 7)}px;background:${e.kind === 'plan' ? 'var(--white)' : k.color};box-shadow:0 0 0 1px ${k.color}"></span>
        <span class="d" style="color:${k.ink}">${dl(e.date)}${e.flag === '*' ? '<b style="color:var(--amber)">*</b>' : ''}${e.flag === '~' ? ' 추정' : ''} · ${e.corrected ? '정정됨' : due ? '예정일 지남' : k.label}</span><span class="x">${esc(e.text)}</span>`;
      m.appendChild(el); items.push({ el, x: left, w: CW });
    });
    if (i.checkDate && i.status !== 'resolved') {
      const cs = checkState(i), c = colOf(i.checkDate);
      const last = cols[cols.length - 1]; if (i.checkDate >= (cols[0].date || cols[0].from) && i.checkDate <= (last.date || last.to)) {
        const el = document.createElement('span');
        el.className = 'flag' + (cs === 'late' ? ' late' : '');
        el.innerHTML = `${I.diamond(cs === 'late' ? 'var(--red)' : 'var(--amberline)', 9)}${cs === 'late' ? '점검일 경과' : '점검'} ${dl(i.checkDate)}`;
        const w = 104; let left = xC(i.checkDate) - 8; if (left + w > MW) left = MW - w;
        el.style.left = left + 'px'; m.appendChild(el); items.push({ el, x: left, w });
      }
    }
    if (!items.length) { const n = document.createElement('span'); n.className = 'norow'; n.textContent = '날짜 있는 이력 없음 · 오른쪽 다음 단계부터 관리'; m.appendChild(n); rowH[i.id] = 44; }
    // pack
    const placed = []; let maxB = 0;
    items.forEach(it => { if (!it.band) it.el.style.width = it.el.style.width || 'auto'; });
    items.forEach(it => {
      const h = it.el.offsetHeight; let top = 12, g = 0;
      while (g++ < 100) { const hit = placed.find(p => it.x < p.x + p.w + 6 && p.x < it.x + it.w + 6 && top < p.top + p.h + 6 && p.top < top + h + 6); if (!hit) break; top = hit.top + hit.h + 6; }
      it.el.style.top = top + 'px'; placed.push({ x: it.x, w: it.w, top, h }); maxB = Math.max(maxB, top + h);
    });
    if (items.length) rowH[i.id] = maxB + 12;
  });
  // sync heights
  issues.forEach(i => {
    const l = $(`.tl-row[data-row="${i.id}"]`, L), r = $(`.tl-row[data-row="${i.id}"]`, R), m = $(`.tl-row[data-row="${i.id}"]`, MI); if (!l) return;
    const h = Math.max(92, l.offsetHeight, r.offsetHeight, rowH[i.id] || 0);
    [l, r, m].forEach(e => e.style.height = h + 'px');
  });
  // dependency connectors (right gutter)
  const dep = []; issues.forEach(i => i.dependsOn.forEach(d => { if (issues.some(v => v.id === d) && (!ro && (d === ui.sel || i.id === ui.sel))) dep.push([d, i.id]); }));
  if (dep.length && !narrow) {
    const top = el => el.offsetTop + el.offsetHeight / 2;
    let svg = `<svg class="dep-svg" width="28" height="${R.scrollHeight}" aria-hidden="true">`;
    dep.forEach(([a, b], k) => {
      const ea = $(`.tl-row[data-row="${a}"]`, R), eb = $(`.tl-row[data-row="${b}"]`, R); if (!ea || !eb) return;
      const y1 = top(ea), y2 = top(eb), xg = 8 + (k % 3) * 5, dir = y2 > y1 ? 1 : -1, r = Math.min(6, Math.abs(y2 - y1) / 2);
      svg += `<path d="M24 ${y1} H${xg + r} Q${xg} ${y1} ${xg} ${y1 + r * dir} V${y2 - r * dir} Q${xg} ${y2} ${xg + r} ${y2} H22" fill="none" stroke="var(--violet)" stroke-width="1.6" stroke-dasharray="4 3"/><path d="M18 ${y2 - 4} L23 ${y2} L18 ${y2 + 4}" fill="none" stroke="var(--violet)" stroke-width="1.6"/><circle cx="24" cy="${y1}" r="2.5" fill="var(--violet)"/>`;
    });
    R.insertAdjacentHTML('beforeend', svg + '</svg>'); R.style.position = 'relative';
  }
  // scroll position
  const keep = ro ? ui.rScrollX : ui.scrollX;
  if (keep !== null) M.scrollLeft = keep; else M.scrollLeft = Math.max(0, todayX - avail * 0.72);
  if (ui.revealNow && (todayX < M.scrollLeft + 40 || todayX > M.scrollLeft + M.clientWidth - 40)) M.scrollLeft = Math.max(0, todayX - M.clientWidth / 2);
  M.onscroll = () => { if (ro) ui.rScrollX = M.scrollLeft; else ui.scrollX = M.scrollLeft; };
  // NOW: 드래그 이동 · 더블클릭/Enter 오늘 · 방향키 하루(Shift 7일)
  const nowEls = $$('[data-now]', MI), nowLine = $('.tl-nowline', MI);
  const paintNow = d => { const x = xAt(d); nowEls.forEach(el => { el.style.left = x + 'px'; el.firstChild.innerHTML = nowLabel(d); el.setAttribute('aria-valuetext', d); }); nowLine.style.left = (x - 1) + 'px'; };
  nowEls.forEach(el => {
    el.onpointerdown = e => {
      if (e.button !== 0) return; e.preventDefault(); e.stopPropagation(); el.focus({ preventScroll: true });
      let cur = doc.now, moved = false; const x0 = e.clientX;
      try { el.setPointerCapture(e.pointerId); } catch (_) { }
      host.classList.add('now-drag');
      el.onpointermove = ev => {
        if (!moved && Math.abs(ev.clientX - x0) < 3) return; moved = true;
        const mr = M.getBoundingClientRect();
        if (ev.clientX > mr.right - 24) M.scrollLeft += 14; else if (ev.clientX < mr.left + 24) M.scrollLeft -= 14;
        const d = dateAt(ev.clientX - MI.getBoundingClientRect().left); if (d !== cur) { cur = d; paintNow(d); }
      };
      el.onpointerup = el.onpointercancel = ev => {
        el.onpointermove = el.onpointerup = el.onpointercancel = null; host.classList.remove('now-drag');
        try { el.releasePointerCapture(ev.pointerId); } catch (_) { }
        if (moved && cur !== doc.now) setNow(cur, true);
      };
    };
    el.ondblclick = e => { e.stopPropagation(); setNow(todayISO(), false); };
    el.onkeydown = e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setNow(todayISO(), false); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); setNow(addD(doc.now, (e.key === 'ArrowLeft' ? -1 : 1) * (e.shiftKey ? 7 : 1)), true); }
      else return;
      const f = $(`[data-now="${el.dataset.now}"]`); if (f) f.focus({ preventScroll: true });
    };
  });
  ui.revealNow = false;
  // interactions
  const rows = id => $$(`.tl-row[data-row="${id}"]`, host);
  host.onmouseover = e => { const r = e.target.closest('[data-row]'); const id = r && r.dataset.row; if (host._hov === id) return; if (host._hov) rows(host._hov).forEach(x => x.classList.remove('hover')); host._hov = id; if (id) rows(id).forEach(x => x.classList.add('hover')); };
  host.onmouseleave = () => { if (host._hov) rows(host._hov).forEach(x => x.classList.remove('hover')); host._hov = null; };
  host.onclick = e => {
    const g = e.target.closest('.tl-l [data-grp]');
    if (g) { ui.collapsed[g.dataset.grp] = !ui.collapsed[g.dataset.grp]; persistUI(); drawCanvas(host, ro); return; }
    const dj = e.target.closest('[data-jump]'); if (dj) { e.stopPropagation(); select(dj.dataset.jump, 'manage'); return; }
    const ev = e.target.closest('[data-ev]'); if (ev) { select(ev.dataset.issue, 'history', ev.dataset.ev); return; }
    const tb = e.target.closest('[data-tab-go]'); if (tb) { select(tb.dataset.row || tb.closest('[data-row]').dataset.row, tb.dataset.tabGo); return; }
    const b = e.target.closest('[data-band]'); if (b) { select(b.dataset.band, 'manage'); setTimeout(() => { const f = $('#i-cons'); if (f) { f.open = true; f.scrollIntoView({ block: 'center' }); } }, 40); return; }
    const r = e.target.closest('[data-row]'); if (r) select(r.dataset.row, ro ? 'manage' : null);
  };
  host.onkeydown = e => {
    const g = e.target.closest('.tl-l [data-grp]'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); g.click(); return; }
    if (!['ArrowDown', 'ArrowUp'].includes(e.key) || !e.target.closest('.tl-l')) return;
    e.preventDefault();
    const list = $$('.tl-l .tl-row', host), idx = list.findIndex(x => x.dataset.row === ui.sel);
    const nx = list[Math.max(0, Math.min(list.length - 1, idx + (e.key === 'ArrowDown' ? 1 : -1)))];
    if (nx) { select(nx.dataset.row); const f = $(`.tl-l .tl-row[data-row="${nx.dataset.row}"]`); if (f) f.focus(); }
  };
}
function rightCell(i, ro) {
  const cs = checkState(i), done = i.actions.filter(a => a.done).length;
  const chips = [];
  if (i.status === 'resolved') chips.push(`<span class="chip ok">해결 · 후속 확인</span>`);
  else chips.push(cs === 'none' ? `<span class="chip warn">점검일 미정</span>` : cs === 'late' ? `<span class="chip bad">점검일 경과 ${dl(i.checkDate)}</span>` : `<span class="chip${cs === 'soon' ? ' warn' : ''}">다음 점검 ${dl(i.checkDate)}</span>`);
  if (i.actions.length) chips.push(`<span class="prog">조치 ${done}/${i.actions.length}<i><b style="width:${pct(done, i.actions.length)}%"></b></i></span>`);
  i.dependsOn.map(issueById).filter(Boolean).forEach(d => chips.push(`<button class="chip ${d.status === 'resolved' ? 'ok' : 'lock'}" data-jump="${d.id}" title="선행 이슈로 이동">${d.status === 'resolved' ? '✓' : I.lock}<span>${esc(clip(d.title, 16))}</span></button>`));
  const oq = openReq(i); if (oq) chips.push(`<button class="chip warn" data-tab-go="requests" data-row="${i.id}">회신 대기 ${oq}</button>`);
  const und = i.events.filter(e => !e.date).length; if (und) chips.push(`<button class="chip" data-tab-go="history" data-row="${i.id}">날짜 미정 이력 ${und}</button>`);
  return `<span class="gate-lab">${i.status === 'resolved' ? '해결 후 확인' : '검증 게이트'}${i.impact.count !== null ? `<span style="color:var(--slate);font-weight:700;letter-spacing:0">· ${i.impact.count}${i.impact.unit === 'API' ? ' API' : '건'}</span>` : ''}</span>
    <span class="gate-txt">${esc(i.gate || '완료 조건을 입력하세요.')}</span>${i.steps.length ? gateMini(i) : ''}<span class="trk">${chips.join('')}</span>`;
}

function gateMini(i) {
  const done = i.steps.filter(s => s[1] === 'done').length, cur = i.steps.find(s => s[1] === 'fail') || i.steps.find(s => s[1] === 'current') || i.steps.find(s => s[1] === 'todo');
  return `<span class="gmini" title="${esc(i.steps.map(s => s[0] + ' ' + STEP[s[1]]).join(' → '))}"><span class="gbar">${i.steps.map(s => `<i class="g-${s[1]}"></i>`).join('')}</span><span class="gtx">${done}/${i.steps.length} 단계${cur ? ` · <b class="${cur[1] === 'fail' ? 'red' : ''}">${esc(cur[0])} ${STEP[cur[1]]}</b>` : ' · 완료'}</span></span>`;
}
/* ================= 표 보기 ================= */
function tableHTML() {
  const list = visibleIssues();
  const k = ui.sort.k, dir = ui.sort.dir;
  const val = i => k === 'priority' ? i.priority : k === 'status' ? Object.keys(STATUS).indexOf(i.status) : k === 'check' ? (i.checkDate || '9999') : k === 'impact' ? -(i.impact.count ?? -1) : k === 'upd' ? -Date.parse(i.updatedAt || 0) : 0;
  list.sort((a, b) => (val(a) > val(b) ? 1 : val(a) < val(b) ? -1 : a.priority - b.priority) * dir);
  const th = (key, label, cls = '') => `<th class="${cls}"><button class="sort" data-sort="${key}" ${k === key ? `aria-sort="${dir > 0 ? 'ascending' : 'descending'}"` : ''}>${label}${I.sortI}</button></th>`;
  if (!list.length) return `<div class="empty"><b>${doc.issues.length ? '조건에 맞는 이슈가 없습니다' : '아직 이슈가 없습니다'}</b>${doc.issues.length ? '검색어나 필터를 바꾸세요.' : '이슈 텍스트 입력으로 시작하세요.'}</div>`;
  return `<div class="tw"><table class="it-table"><thead><tr>${th('priority', '우선')}<th style="min-width:280px">이슈 / 현황</th>${th('status', '상태')}<th>담당</th>${th('check', '다음 점검')}<th>조치</th><th>회신 대기</th>${th('impact', '영향', 'n')}${th('upd', '최근 갱신')}</tr></thead><tbody>
    ${list.map(i => { const cs = checkState(i), d = daysSince(i.updatedAt); return `<tr data-row="${i.id}" class="${i.id === ui.sel ? 'sel' : ''}" tabindex="0"><td><b>P${i.priority}</b></td><td><span class="ttl">${esc(i.title)}</span><span class="smy">${esc(i.area)} · ${esc(i.summary)}</span></td><td>${badge(i.status, true)}</td><td style="${i.owner.trim() ? '' : 'color:var(--amber);font-weight:600'}">${esc(i.owner.trim() || '확인 필요')}</td>
      <td style="white-space:nowrap;${cs === 'late' ? 'color:var(--red);font-weight:700' : cs === 'none' ? 'color:var(--amber)' : ''}">${i.checkDate ? i.checkDate + (cs === 'late' ? ' · 경과' : '') : '미정'}</td><td class="num">${i.actions.filter(a => a.done).length}/${i.actions.length}</td><td class="num">${openReq(i) || '—'}</td><td class="n">${i.impact.count !== null ? i.impact.count + (i.impact.unit === 'API' ? ' API' : '건') : '—'}</td><td class="num muted" style="white-space:nowrap">${d === null ? '—' : d === 0 ? '오늘' : d + '일 전'}</td></tr>`; }).join('')}</tbody></table></div>`;
}
function bindTable(el) {
  $$('[data-sort]', el).forEach(b => b.onclick = () => { const k = b.dataset.sort; ui.sort = { k, dir: ui.sort.k === k ? -ui.sort.dir : 1 }; persistUI(); refresh(['canvas']); });
  $$('tbody tr', el).forEach(r => { r.onclick = () => select(r.dataset.row); r.onkeydown = e => { if (e.key === 'Enter') select(r.dataset.row); }; });
}

/* ================= 인스펙터 ================= */
function inspHeadHTML(i) {
  if (!i) return '';
  const d = daysSince(i.updatedAt);
  return `<div class="row1"><span class="eyebrow"><span style="color:var(--navy7);font-weight:800">P${i.priority}</span>·<span>${esc(i.area)}</span></span>${badge(i.status)}</div>
    <h2>${esc(i.title)}</h2>
    <div class="facts"><span class="chip">${esc(i.owner.trim() || '담당 확인 필요')}</span>${(() => { const cs = checkState(i); return cs === 'none' ? '<span class="chip warn">점검일 미정</span>' : cs === 'late' ? `<span class="chip bad">점검일 경과 ${dl(i.checkDate)}</span>` : `<span class="chip">다음 점검 ${dl(i.checkDate)}</span>`; })()}<span class="chip">갱신 ${d === 0 ? '오늘' : d + '일 전'}</span></div>`;
}
function inspHTML() {
  const i = issueById(ui.sel);
  if (!i) return `<div class="empty" style="padding:48px 20px"><b>이슈를 선택하세요</b>타임라인이나 표에서 이슈를 누르면<br>담당·점검일·조치·원문을 관리할 수 있습니다.</div>`;
  const tabs = [['manage', '조치 · 점검', ''], ['requests', '확인 요청', openReq(i) || ''], ['history', '원문 · 이력', i.events.length || '']];
  return `<div class="insp-head" id="insp-head">${inspHeadHTML(i)}</div>
    <div class="tabs" role="tablist">${tabs.map(([k, l, n]) => `<button role="tab" data-itab="${k}" aria-selected="${ui.itab === k}">${l}${n !== '' ? `<span class="count">${n}</span>` : ''}</button>`).join('')}</div>
    <div class="insp-body" id="insp-body">${ui.itab === 'requests' ? reqTab(i) : ui.itab === 'history' ? histTab(i) : manageTab(i)}</div>
    <div class="insp-foot"><span>변경 내용은 자동 저장됩니다</span><button class="btn sm danger" id="i-del">이슈 삭제</button></div>`;
}
function manageTab(i) {
  const groups = doc.groupOrder;
  const others = sorted(doc.issues.filter(v => v.id !== i.id));
  return `<div class="sec">
      <div class="field"><label for="i-title">이슈 제목</label><input class="input" id="i-title" data-f="title" value="${esc(i.title)}" maxlength="200"></div>
      <div class="pair"><div class="field"><label for="i-status">상태</label><select class="select" id="i-status" data-f="status">${Object.entries(STATUS).map(([k, s]) => `<option value="${k}" ${k === i.status ? 'selected' : ''}>${s.label}</option>`).join('')}</select></div>
        <div class="field"><label for="i-pri">우선순위</label><select class="select" id="i-pri" data-f="priority">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<option value="${n}" ${n === i.priority ? 'selected' : ''}>P${n}</option>`).join('')}</select></div></div>
      <div class="field"><label for="i-owner">담당 / 관련 부문<small>${i.owner.trim() ? '' : '미정'}</small></label><input class="input" id="i-owner" data-f="owner" value="${esc(i.owner)}" placeholder="담당 확인 필요" maxlength="200"></div>
      <div class="pair"><div class="field"><label for="i-check">다음 점검일</label><input class="input" type="date" id="i-check" data-f="checkDate" value="${i.checkDate}"></div>
        <div class="field"><label for="i-group">영역</label><input class="input" id="i-group" data-f="group" list="i-groups" value="${esc(i.group)}" maxlength="60"><datalist id="i-groups">${groups.map(g => `<option value="${esc(g)}">`).join('')}</datalist></div></div>
      <div class="field"><label for="i-sum">현재 현황</label><textarea class="textarea" id="i-sum" data-f="summary" rows="3">${esc(i.summary)}</textarea></div>
      <div class="field"><label for="i-gate">완료 조건 · 검증 게이트</label><textarea class="textarea" id="i-gate" data-f="gate" rows="2">${esc(i.gate)}</textarea></div>
      <div class="field"><span class="label">게이트 단계<small>눌러서 대기 → 진행 → 완료 → 실패</small></span>
        <div class="step-edit">${i.steps.map((s, n) => `<span class="step st-${s[1]}" role="button" tabindex="0" data-istep="${n}" title="${STEP[s[1]]}">${s[1] === 'done' ? '✓' : s[1] === 'fail' ? '✕' : ''}<span>${esc(s[0])}</span><button class="rm" data-rmstep="${n}" aria-label="${esc(s[0])} 단계 삭제">${I.x}</button></span>`).join('')}</div>
        <form class="addrow" id="f-step"><label class="sr" for="n-step">새 단계</label><input class="input sm" id="n-step" placeholder="단계 추가 (예: 수령 확인)" maxlength="40"><button class="btn sm">추가</button></form></div>
    </div>
    <div class="sec"><div class="sec-h"><h3>다음 조치 <small>${i.actions.filter(a => a.done).length}/${i.actions.length}</small></h3></div>
      <div class="list">${i.actions.map(a => `<label class="li${a.done ? ' done' : ''}"><input type="checkbox" data-act="${a.id}" ${a.done ? 'checked' : ''}><span class="grow">${esc(a.text)}</span><button class="x" data-rmact="${a.id}" aria-label="조치 삭제">${I.x}</button></label>`).join('') || '<p class="caption">아직 조치가 없습니다.</p>'}</div>
      <form class="addrow" id="f-act"><label class="sr" for="n-act">새 조치</label><input class="input sm" id="n-act" placeholder="다음 조치 추가" maxlength="500"><button class="btn sm" disabled>추가</button></form></div>
    <div class="sec"><div class="sec-h"><h3>점검 결과 · 메모</h3></div>
      <form id="f-note" style="display:flex;flex-direction:column;gap:8px"><label class="sr" for="n-note">점검 결과</label><textarea class="textarea" id="n-note" rows="3" placeholder="확인한 사실, 남은 제약, 다음 점검을 남기세요." maxlength="5000"></textarea><button class="btn primary sm" style="align-self:flex-end" disabled>점검 결과 기록</button></form>
      <div class="notes">${[...i.notes].reverse().slice(0, 30).map(n => `<div class="note${n.sys ? ' sys' : ''}"><time>${new Date(n.at).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}${n.sys ? ' · 자동 기록' : ''}</time>${esc(n.text)}</div>`).join('')}</div></div>
    <div class="sec">
      <details class="more" id="i-cons"><summary>지속 제약 · 영향 범위</summary><div>
        <div class="field"><label for="i-ctext">지금 막고 있는 상태<small>비우면 타임라인 바를 숨김</small></label><input class="input" id="i-ctext" data-f="constraint.text" value="${esc(i.constraint ? i.constraint.text : '')}" maxlength="300"></div>
        <div class="pair"><div class="field"><label for="i-cstart">시작일<small>비우면 미상</small></label><input class="input" type="date" id="i-cstart" data-f="constraint.start" value="${i.constraint ? i.constraint.start : ''}"></div>
          <div class="field"><label for="i-ctone">강도</label><select class="select" id="i-ctone" data-f="constraint.tone"><option value="red" ${!i.constraint || i.constraint.tone === 'red' ? 'selected' : ''}>차단</option><option value="amber" ${i.constraint && i.constraint.tone === 'amber' ? 'selected' : ''}>제한</option></select></div></div>
        <div class="pair"><div class="field"><label for="i-icount">영향 수량<small>미확정이면 비움</small></label><input class="input" type="number" min="0" id="i-icount" data-f="impact.count" value="${i.impact.count ?? ''}"></div>
          <div class="field"><label for="i-iunit">단위</label><select class="select" id="i-iunit" data-f="impact.unit"><option ${i.impact.unit === 'TC' ? 'selected' : ''}>TC</option><option ${i.impact.unit === 'API' ? 'selected' : ''}>API</option></select></div></div>
        <div class="field"><label for="i-itext">영향 범위</label><textarea class="textarea" id="i-itext" data-f="impact.text" rows="2">${esc(i.impact.text)}</textarea></div></div></details>
      <details class="more"><summary>선행 이슈 <span class="count" style="margin-left:auto;margin-right:10px">${i.dependsOn.length}</span></summary><div>
        <p class="caption">이 이슈가 진행되려면 먼저 해결돼야 하는 이슈를 고르세요. 타임라인 오른쪽에 연결선으로 표시됩니다.</p>
        <div class="deps">${others.map(v => `<label class="check"><input type="checkbox" data-dep="${v.id}" ${i.dependsOn.includes(v.id) ? 'checked' : ''}><span>P${v.priority} · ${esc(v.title)}</span></label>`).join('')}</div></div></details>
      <details class="more"><summary>보고용 시나리오</summary><div>
        <div class="field"><label for="i-succ">선행 조건 해소 시</label><textarea class="textarea" id="i-succ" data-f="scenario.success" rows="3">${esc(i.scenario.success)}</textarea></div>
        <div class="field"><label for="i-fail">해소되지 않을 때</label><textarea class="textarea" id="i-fail" data-f="scenario.failure" rows="3">${esc(i.scenario.failure)}</textarea></div></div></details>
    </div>`;
}
function reqTab(i) {
  const parties = [...new Set(doc.issues.flatMap(v => v.requests.map(r => r.party)).filter(Boolean))];
  return `<div class="sec"><div class="sec-h"><h3>상대 부문 확인 요청 <small>${i.requests.filter(r => r.state === 'done').length}/${i.requests.length} 완료</small></h3></div>
      <p class="caption">상태 버튼을 누를 때마다 회신 대기 → 회신 받음 → 확인 완료로 바뀝니다.</p>
      <div class="list">${i.requests.map(r => `<div class="li${r.state === 'done' ? ' done' : ''}"><button class="stbtn ${r.state}" data-req="${r.id}">${REQ[r.state]}</button><span class="grow">${esc(r.text)}<span class="req-meta">${esc(r.party || '상대 미정')}${r.at ? ' · ' + esc(r.at) : ''}</span></span><button class="x" data-rmreq="${r.id}" aria-label="요청 삭제">${I.x}</button></div>`).join('') || '<p class="caption">확인 요청이 없습니다.</p>'}</div></div>
    <div class="sec"><div class="sec-h"><h3>요청 추가</h3></div>
      <form id="f-req" style="display:flex;flex-direction:column;gap:8px">
        <div class="field"><label for="n-party">상대 부문</label><input class="input sm" id="n-party" list="n-parties" value="${esc((i.requests[0] || {}).party || '')}" maxlength="100"><datalist id="n-parties">${parties.map(p => `<option value="${esc(p)}">`).join('')}</datalist></div>
        <div class="field"><label for="n-req">질의 내용</label><textarea class="textarea" id="n-req" rows="2" placeholder="예: 인증 오류 로그 공유 요청" maxlength="1000"></textarea></div>
        <button class="btn primary sm" style="align-self:flex-end" disabled>요청 추가</button></form></div>`;
}
function histTab(i) {
  const list = [...i.events].sort((a, b) => (a.date || '9999') < (b.date || '9999') ? -1 : (a.date || '9999') > (b.date || '9999') ? 1 : 0);
  return `<div class="sec"><div class="sec-h"><h3>확인 이력 <small>${list.length}건</small></h3></div>
      <div class="hist">${list.map(e => ui.editEvent === e.id ? evEdit(e) : `<div class="he${e.corrected ? ' corr' : ''}${ui.flash === e.id ? ' flash' : ''}" data-he="${e.id}"><time>${e.date ? dl(e.date) : '미정'}<small>${e.date ? wd(e.date) + '요일' : '날짜 미상'}</small></time>
        <div class="body"><div class="top"><span class="badge sm" style="background:${e.kind === 'plan' ? 'var(--blue05)' : 'transparent'};color:${KIND[e.kind].ink};box-shadow:inset 0 0 0 1px ${KIND[e.kind].color}">${KIND[e.kind].label}</span>${planDue(e) ? '<span class="badge sm b-amber">예정일 지남 · 결과 확인</span>' : ''}${e.corrected ? '<span class="badge sm b-red">정정됨</span>' : ''}${e.flag === '*' ? '<span class="badge sm b-amber">날짜 재확인</span>' : ''}${e.flag === '~' ? '<span class="badge sm b-amber">추정</span>' : ''}</div>
        <p>${esc(e.text)}</p>${e.evidence && e.evidence !== e.text ? `<blockquote class="quote">${esc(e.evidence)}</blockquote>` : ''}
        <div class="acts"><button class="link" data-editev="${e.id}">편집</button><button class="link" style="color:var(--red)" data-rmev="${e.id}">삭제</button></div></div></div>`).join('') || '<p class="caption">날짜가 있는 확인 이력이 없습니다. 아래에서 추가하세요.</p>'}</div></div>
    <div class="sec"><div class="sec-h"><h3>이력 추가</h3></div>
      <form id="f-ev" style="display:flex;flex-direction:column;gap:8px">
        <div class="pair"><div class="field"><label for="n-evd">날짜<small>비우면 미정</small></label><input class="input sm" type="date" id="n-evd" value="${doc.now}"></div>
          <div class="field"><label for="n-evk">종류</label><select class="select sm" id="n-evk">${Object.entries(KIND).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('')}</select></div></div>
        <div class="field"><label for="n-evt">확인한 내용</label><textarea class="textarea" id="n-evt" rows="2" maxlength="1000"></textarea></div>
        <p class="caption">NOW(${dl(doc.now)}) 이후 날짜는 자동으로 '예정'이 됩니다.</p>
        <button class="btn primary sm" style="align-self:flex-end" disabled>이력 기록</button></form></div>
    ${i.evidence.length ? `<div class="sec"><div class="sec-h"><h3>원문 근거</h3></div>${i.evidence.map(t => `<blockquote class="quote">${esc(t)}</blockquote>`).join('')}</div>` : ''}`;
}
function evEdit(e) {
  return `<form class="he-edit" data-evform="${e.id}"><div class="pair"><div class="field"><label for="e-d">날짜</label><input class="input sm" type="date" id="e-d" value="${e.date}"></div>
    <div class="field"><label for="e-k">종류</label><select class="select sm" id="e-k">${Object.entries(KIND).map(([k, v]) => `<option value="${k}" ${k === e.kind ? 'selected' : ''}>${v.label}</option>`).join('')}</select></div></div>
    <div class="field"><label for="e-t">내용</label><textarea class="textarea" id="e-t" rows="2">${esc(e.text)}</textarea></div>
    <div class="pair"><div class="field"><label for="e-f">날짜 표시</label><select class="select sm" id="e-f"><option value="">확정</option><option value="*" ${e.flag === '*' ? 'selected' : ''}>재확인 필요</option><option value="~" ${e.flag === '~' ? 'selected' : ''}>추정</option></select></div>
      <div class="field" style="justify-content:flex-end"><label class="check" style="height:32px;align-items:center"><input type="checkbox" id="e-c" ${e.corrected ? 'checked' : ''} style="margin:0">정정된 안내</label></div></div>
    <div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn sm" data-cancelev>취소</button><button class="btn primary sm">저장</button></div></form>`;
}
function setPath(o, path, v) { const p = path.split('.'); let t = o; for (let k = 0; k < p.length - 1; k++) { if (!t[p[k]]) t[p[k]] = {}; t = t[p[k]]; } t[p[p.length - 1]] = v; }
function bindInsp() {
  const box = $('#insp'), i = issueById(ui.sel);
  $$('[data-itab]', box).forEach(b => b.onclick = () => { ui.itab = b.dataset.itab; ui.flash = null; ui.editEvent = null; persistUI(); refresh(['insp']); });
  if (!i) return;
  $('#i-del').onclick = () => {
    const name = i.title;
    mutate(d => { d.issues = d.issues.filter(v => v.id !== i.id); d.issues.forEach(v => v.dependsOn = v.dependsOn.filter(x => x !== i.id)); }, { undo: `'${name}' 삭제`, parts: [] });
    ui.sel = (sorted(doc.issues)[0] || {}).id || null; render(); toast(`'${clip(name, 20)}' 이슈를 삭제했습니다`, { label: '되돌리기', fn: undo });
  };
  // 단순 필드
  $$('[data-f]', box).forEach(inp => {
    const f = inp.dataset.f;
    const apply = () => {
      let v = inp.value;
      if (f === 'priority') v = +v;
      if (f === 'impact.count') v = v === '' ? null : Math.max(0, Math.min(1e7, Math.floor(+v)));
      if (f === 'checkDate' && v && !isDate(v)) return;
      if (f.startsWith('constraint.')) {
        if (!i.constraint) i.constraint = { text: '', start: '', tone: 'red' };
        setPath(i, f, v); if (!i.constraint.text.trim()) i.constraint = f === 'constraint.text' ? null : i.constraint;
      } else if (f === 'status') {
        const from = i.status; i.status = v; i.notes.push({ at: new Date().toISOString(), text: `상태 변경: ${STATUS[from].label} → ${STATUS[v].label}`, sys: true });
      } else if (f === 'group') { i.group = v.trim() || '미분류'; i.area = i.area && i.area.includes('·') ? i.area : i.group; if (!doc.groupOrder.includes(i.group)) doc.groupOrder.push(i.group); doc.groupOrder = doc.groupOrder.filter(g => doc.issues.some(x => x.group === g)); }
      else setPath(i, f, v);
      i.updatedAt = new Date().toISOString(); doc.example = false; persist();
    };
    const isText = (inp.tagName === 'INPUT' && !['date', 'number'].includes(inp.type)) || inp.tagName === 'TEXTAREA';
    if (isText) inp.addEventListener('input', () => { apply(); refreshSoon(['strip', 'canvas', 'blocks', 'insphead']); });
    else inp.addEventListener('change', () => { apply(); if (['status', 'priority', 'group'].includes(f)) refresh(['dochead', 'strip', 'wsbar', 'canvas', 'blocks', 'insp']); else refresh(['strip', 'canvas', 'blocks', 'insphead']); });
  });
  // 게이트 단계
  $$('[data-istep]', box).forEach(s => { const go = e => { if (e.target.closest('[data-rmstep]')) return; const st = i.steps[+s.dataset.istep], order = ['todo', 'current', 'done', 'fail']; const nx = order[(order.indexOf(st[1]) + 1) % 4]; mutate(() => { st[1] = nx; i.notes.push({ at: new Date().toISOString(), text: `게이트 단계 '${st[0]}' → ${STEP[nx]}`, sys: true }); }, { parts: ['strip', 'canvas', 'insp'], touch: i.id }); }; s.onclick = go; s.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(e); } }; });
  $$('[data-rmstep]', box).forEach(b => b.onclick = e => { e.stopPropagation(); mutate(() => i.steps.splice(+b.dataset.rmstep, 1), { parts: ['strip', 'canvas', 'insp'], touch: i.id, undo: '단계 삭제' }); });
  const fs = $('#f-step'); if (fs) fs.onsubmit = e => { e.preventDefault(); const v = $('#n-step').value.trim(); if (!v) return; mutate(() => i.steps.push([v, 'todo']), { parts: ['strip', 'canvas', 'insp'], touch: i.id }); setTimeout(() => $('#n-step') && $('#n-step').focus(), 0); };
  // 조치
  $$('[data-act]', box).forEach(c => c.onchange = () => { const a = i.actions.find(x => x.id === c.dataset.act); mutate(() => { a.done = c.checked; if (c.checked) i.notes.push({ at: new Date().toISOString(), text: `조치 완료: ${a.text}`, sys: true }); }, { parts: ['canvas', 'insp', 'blocks'], touch: i.id }); setTimeout(() => { const n = $(`[data-act="${a.id}"]`); if (n) n.focus(); }, 0); });
  $$('[data-rmact]', box).forEach(b => b.onclick = e => { e.preventDefault(); mutate(() => i.actions = i.actions.filter(a => a.id !== b.dataset.rmact), { parts: ['canvas', 'insp'], touch: i.id, undo: '조치 삭제', toast: '조치를 삭제했습니다' }); });
  wireAdd('#f-act', '#n-act', v => mutate(() => i.actions.push({ id: uid(), text: v, done: false }), { parts: ['canvas', 'insp'], touch: i.id }), '#n-act');
  wireAdd('#f-note', '#n-note', v => mutate(() => i.notes.push({ at: new Date().toISOString(), text: v }), { parts: ['insp', 'canvas'], touch: i.id, toast: '점검 결과를 기록했습니다' }));
  // 선행 이슈
  $$('[data-dep]', box).forEach(c => c.onchange = () => mutate(() => { i.dependsOn = c.checked ? [...new Set([...i.dependsOn, c.dataset.dep])] : i.dependsOn.filter(x => x !== c.dataset.dep); }, { parts: ['canvas'], touch: i.id }));
  // 요청
  $$('[data-req]', box).forEach(b => b.onclick = () => { const r = i.requests.find(x => x.id === b.dataset.req), order = ['open', 'answered', 'done']; const nx = order[(order.indexOf(r.state) + 1) % 3]; mutate(() => { r.state = nx; r.at = nx === 'open' ? '' : `${REQ[nx]} ${new Date().toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })}`; }, { parts: ['canvas', 'insp', 'blocks'], touch: i.id }); setTimeout(() => { const n = $(`[data-req="${r.id}"]`); if (n) n.focus(); }, 0); });
  $$('[data-rmreq]', box).forEach(b => b.onclick = () => mutate(() => i.requests = i.requests.filter(r => r.id !== b.dataset.rmreq), { parts: ['canvas', 'insp', 'blocks'], touch: i.id, undo: '요청 삭제', toast: '확인 요청을 삭제했습니다' }));
  wireAdd('#f-req', '#n-req', v => mutate(() => i.requests.push({ id: uid(), party: $('#n-party').value.trim(), text: v, state: 'open', at: '' }), { parts: ['canvas', 'insp', 'blocks'], touch: i.id, toast: '확인 요청을 추가했습니다' }));
  // 이력
  wireAdd('#f-ev', '#n-evt', v => { const d = $('#n-evd').value; let k = $('#n-evk').value; if (d && d > doc.now) k = 'plan'; mutate(() => i.events.push({ id: uid(), date: isDate(d) ? d : '', kind: k, text: v, flag: '', corrected: false, evidence: '' }), { parts: ['canvas', 'insp'], touch: i.id, toast: '이력을 기록했습니다' }); });
  $$('[data-editev]', box).forEach(b => b.onclick = () => { ui.editEvent = b.dataset.editev; refresh(['insp']); setTimeout(() => $('#e-t') && $('#e-t').focus(), 0); });
  $$('[data-rmev]', box).forEach(b => b.onclick = () => mutate(() => i.events = i.events.filter(e => e.id !== b.dataset.rmev), { parts: ['canvas', 'insp'], touch: i.id, undo: '이력 삭제', toast: '이력을 삭제했습니다' }));
  const ef = $('[data-evform]', box);
  if (ef) {
    ef.onsubmit = e => { e.preventDefault(); const ev = i.events.find(x => x.id === ef.dataset.evform); const t = $('#e-t').value.trim(); if (!t) { $('#e-t').focus(); return; } ui.editEvent = null; mutate(() => { ev.date = isDate($('#e-d').value) ? $('#e-d').value : ''; ev.kind = $('#e-k').value; ev.text = t; ev.flag = $('#e-f').value; ev.corrected = $('#e-c').checked; }, { parts: ['canvas', 'insp'], touch: i.id }); };
    $('[data-cancelev]', ef).onclick = () => { ui.editEvent = null; refresh(['insp']); };
  }
}
function wireAdd(form, input, fn, refocus) {
  const f = $(form); if (!f) return;
  const inp = $(input), btn = $('button:not([type=button])', f);
  const sync = () => { if (btn) btn.disabled = !inp.value.trim(); };
  inp.addEventListener('input', sync); sync();
  if (inp.tagName === 'TEXTAREA') inp.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); f.requestSubmit(); } });
  f.onsubmit = e => { e.preventDefault(); const v = inp.value.trim(); if (!v) { inp.focus(); return; } fn(v); if (refocus) setTimeout(() => { const n = $(refocus); if (n) n.focus(); }, 0); };
}

/* ================= 하단 블록 ================= */
function qaTableHTML(editable) {
  const t = metricTotals(doc.metrics), w = metricWarnings(doc.metrics);
  return `<section class="card blk"><div class="blk-h"><h3>QA 수행 가능 분류<small>사전 분류 · Pass/Fail 아님</small></h3>${editable ? '<button class="btn sm" id="b-qa">분류 편집</button>' : ''}</div>
    ${doc.metrics.length ? `<div class="tw"><table><thead><tr><th>영역</th><th class="n">전체</th><th class="n">N/T</th><th class="n">제한적</th><th class="n">기타</th></tr></thead><tbody>
      ${doc.metrics.map(m => `<tr><td><b>${esc(m.label)}</b></td><td class="n">${m.total}</td><td class="n" style="color:var(--red)">${m.blocked}</td><td class="n" style="color:var(--amber)">${m.limited || '—'}</td><td class="n">${m.other}</td></tr>`).join('')}
      ${doc.metrics.length > 1 ? `<tr class="total"><td>합계</td><td class="n">${t.total}</td><td class="n" style="color:var(--red)">${t.blocked}</td><td class="n" style="color:var(--amber)">${t.limited}</td><td class="n">${t.other}</td></tr>` : ''}</tbody></table></div>
      ${t.total && !w.length ? `<div class="dist" aria-label="N/T ${pctS(t.blocked, t.total)}, 제한적 ${pctS(t.limited, t.total)}, 기타 ${pctS(t.other, t.total)}">${[['var(--red)', t.blocked], ['var(--amberline)', t.limited], ['#8FA5C0', t.other]].filter(([, n]) => n).map(([c, n]) => `<span style="width:${pct(n, t.total)}%;background:${c}">${pct(n, t.total) >= 9 ? pctS(n, t.total) : ''}</span>`).join('')}</div>` : ''}
      ${w.map(x => `<div class="err">${esc(x)}</div>`).join('')}` : `<p class="caption">원문에 TC 분류표가 없습니다.${editable ? ' 분류 편집에서 추가할 수 있습니다.' : ''}</p>`}
    <p class="caption">기타는 별도 제한 미분류이며 수행 가능 확정이 아닙니다.</p></section>`;
}
function reasonsHTML() {
  const R = doc.reasons;
  if (!R || !R.rows.length) return `<section class="card blk"><div class="blk-h"><h3>N/T 사유 분해</h3></div><p class="caption">원문에 사유별 표가 없습니다.</p></section>`;
  const sum = R.rows.reduce((a, r) => a + r.count, 0), max = Math.max(1, ...R.rows.map(r => r.count));
  return `<section class="card blk"><div class="blk-h"><h3>${esc(R.title)}<small>해소 조건별</small></h3></div>
    <div class="tw"><table class="rtable"><thead><tr><th>사유</th><th class="n">TC</th><th style="width:18%"></th><th>연결 이슈</th></tr></thead><tbody>
    ${R.rows.map(r => { const it = doc.issues.find(i => i.key && i.key === r.key); return `<tr><td><b style="white-space:nowrap">${esc(r.label)}</b><span style="display:block;font-size:11.5px;color:var(--slate)">${esc(r.action)}</span></td><td class="n">${r.count}</td><td><span class="rbar${r.count === max ? ' g' : ''}" style="width:${Math.max(4, pct(r.count, max))}%"></span></td><td>${it ? `<button class="chip" data-jump="${it.id}" title="${esc(it.title)}"><span>P${it.priority} · ${esc(it.key || clip(it.title, 10))}</span></button>` : '<span class="caption">—</span>'}</td></tr>`; }).join('')}
    <tr class="total"><td>사유별 합계</td><td class="n">${sum}</td><td colspan="2" style="font-weight:600;color:var(--slate6)">${R.reported ? `QA 집계 <b style="color:var(--red)">${R.reported}</b>` : ''}</td></tr></tbody></table></div>
    ${R.reported && R.reported !== sum ? `<div class="qnote">사유별 합계 ${sum} ≠ QA 집계 ${R.reported} · 차이 ${Math.abs(R.reported - sum)}건${R.note ? ' · ' + esc(R.note) : ''}</div>` : ''}</section>`;
}
function hygieneHTML(interactive) {
  const open = doc.issues.filter(i => i.status !== 'resolved');
  const rows = [
    ['owner', '담당 미정', open.filter(i => !i.owner.trim()).length],
    ['check', '점검일 미정', open.filter(i => !i.checkDate).length],
    ['late', '점검일 경과', open.filter(i => checkState(i) === 'late').length],
    ['req', '회신 대기 요청', doc.issues.reduce((a, i) => a + openReq(i), 0)]];
  return `<section class="card blk"><div class="blk-h"><h3>관리 공백 · 확인할 사항</h3></div>
    <div class="hyg">${rows.map(([k, l, n]) => `<${interactive ? 'button' : 'div'} class="gate-row" style="grid-template-columns:minmax(0,1fr) auto;align-items:center;cursor:${interactive ? 'pointer' : 'default'}" ${interactive ? `data-gap="${k}"` : ''}><span style="font-size:12.5px;font-weight:700">${l}</span><b class="num" style="font-size:18px;color:${n ? (k === 'late' ? 'var(--red)' : 'var(--amber)') : 'var(--green)'}">${n}</b></${interactive ? 'button' : 'div'}>`).join('')}</div>
    ${doc.notes.map(n => `<div class="qnote">${esc(n)}</div>`).join('')}
    <p class="caption">${interactive ? '숫자를 누르면 해당 이슈만 타임라인에 표시합니다. ' : ''}영역별 선행 조건은 독립적으로 확인합니다.</p></section>`;
}
function blocksHTML(interactive) { return qaTableHTML(interactive) + reasonsHTML() + hygieneHTML(interactive); }
function bindBlocks(el) {
  const q = $('#b-qa', el); if (q) q.onclick = openQA;
  $$('[data-jump]', el).forEach(b => b.onclick = () => select(b.dataset.jump, 'manage'));
  $$('[data-gap]', el).forEach(b => b.onclick = () => { ui.fGap = ui.fGap === b.dataset.gap ? '' : b.dataset.gap; ui.list = false; refresh(['wsbar', 'canvas']); $('#wsbar').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
}

/* ================= 보고 화면 ================= */
function reportHTML() {
  const v = verdict(), oq = doc.issues.reduce((a, i) => a + openReq(i), 0);
  const tab = (k, l, n) => `<button id="rt-${k}" aria-pressed="${ui.rtab === k}">${l}${n !== undefined ? `<span class="count">${n}</span>` : ''}</button>`;
  const head = `<section class="hero"><div><div class="ey">REPORT · 이해관계자 보고 · 보고 기준일 ${doc.asOf} (${wd(doc.asOf)}) · NOW ${dl(doc.now)}${lagText() ? ` · ${lagText()}` : ''}</div><h1>${esc(doc.title)}</h1><div class="sub">${esc(doc.subtitle || '환경 정상화 → 수행 범위 재분류 → 테스트 계획 확정')}</div></div>
      <div class="hero-r"><span class="verdict-pill" style="background:${v.tone === 'red' ? 'var(--red)' : v.tone === 'green' ? 'var(--green)' : 'var(--amberline)'};color:#fff">${esc(v.text)}</span><div class="pills">${statusPills(true)}${oq ? `<span class="badge">회신 대기 ${oq}</span>` : ''}</div></div></section>
    <div class="rtabs"><div class="rtabs-l"><div class="seg" role="group" aria-label="보고 탭">${tab('summary', '요약')}${tab('scenario', '시나리오')}${tab('requests', '회신 요청', oq)}</div>
      <span class="caption">관리 화면의 현재 상태가 그대로 반영됩니다</span></div>${window.top === window ? '<button class="btn" id="b-print">인쇄 / PDF</button>' : ''}</div>`;
  let body = '';
  if (ui.rtab === 'summary') body = reportSummary();
  else if (ui.rtab === 'scenario') body = reportScenario();
  else body = reportRequests();
  return head + body + footHTML();
}
function reportSummary() {
  const open = sorted(doc.issues.filter(i => i.status !== 'resolved'));
  return `${kpiHTML()}
    <div class="two"><section class="card blk"><div class="blk-h"><h3>핵심 판단</h3></div>
      ${doc.conclusion.points.length ? doc.conclusion.points.map((p, n) => `<div class="point"><i>${n + 1}</i><div><b>${esc(p.title)}</b><p>${esc(p.body)}</p></div></div>`).join('') : '<p class="caption">종합 의견이 없습니다.</p>'}
      ${doc.conclusion.summary ? `<div class="concl">${esc(doc.conclusion.summary)}</div>` : ''}</section>
    <section class="card blk"><div class="blk-h"><h3>다음 점검 큐<small>우선순위 · 담당 · 완료 조건</small></h3><span class="count">${open.length}</span></div>
      <div class="queue">${open.slice(0, 6).map(i => { const cs = checkState(i); return `<button class="qi" data-open="${i.id}"><span class="pr${i.priority === 1 ? ' p1' : ''}">P${i.priority}</span><span style="min-width:0"><span class="qt" style="display:block">${esc(i.title)}</span><span class="qo" style="display:block">${esc(i.owner.trim() || '담당 확인 필요')}</span><span class="qg" style="display:block">${esc(clip(i.gate, 110))}</span></span><span class="qr">${badge(i.status, true)}<span class="chip ${cs === 'late' ? 'bad' : cs === 'none' ? 'warn' : ''}">${cs === 'none' ? '점검일 미정' : (cs === 'late' ? '경과 ' : '점검 ') + dl(i.checkDate)}</span></span></button>`; }).join('') || '<p class="caption">미해결 이슈가 없습니다.</p>'}</div></section></div>
    <section class="card canvas" id="r-canvas"></section>
    <section class="card blk"><div class="blk-h"><h3>Blocker 현황<small>우선순위순</small></h3></div>
      <div class="tw"><table><thead><tr><th>우선</th><th>이슈</th><th>상태</th><th style="min-width:220px">완료 조건</th><th class="n">영향</th><th>담당</th><th>다음 점검</th></tr></thead><tbody>
      ${sorted(doc.issues).map(i => `<tr><td><b>P${i.priority}</b></td><td><b>${esc(i.title)}</b><span style="display:block;font-size:11.5px;color:var(--slate)">${esc(i.area)}</span></td><td>${badge(i.status, true)}</td><td style="color:var(--slate6)">${esc(i.gate)}</td><td class="n" style="white-space:nowrap">${i.impact.count !== null ? `<b>${i.impact.count}</b>${i.impact.unit === 'API' ? ' API' : '건'}` : '—'}</td><td>${esc(i.owner || '확인 필요')}</td><td style="white-space:nowrap">${i.checkDate || '미정'}</td></tr>`).join('')}</tbody></table></div></section>
    <section class="blocks">${blocksHTML(false)}</section>`;
}
function scenarioState() {
  const on = id => { const i = issueById(id); return i && (i.status === 'resolved' || !!ui.assume[id]); };
  return doc.issues.map(i => {
    const self = on(i.id);
    const deps = i.dependsOn.map(issueById).filter(Boolean);
    const freed = !self && deps.length > 0 && deps.every(d => on(d.id)) && i.status !== 'resolved';
    return { i, self, real: i.status === 'resolved', deps, freed, blockedBy: deps.filter(d => !on(d.id)) };
  });
}
function reportScenario() {
  const st = scenarioState(), n = Object.values(ui.assume).filter(Boolean).length;
  const freed = st.filter(s => s.freed), remain = st.filter(s => !s.self && s.i.status === 'blocked');
  const card = s => { const i = s.i; const lab = s.real ? ['실제 해결', 'b-green'] : s.self ? ['해소 가정', 'b-green'] : s.freed ? ['선행 조건 해소 가정', 'b-blue'] : ['현 상태 유지', STATUS[i.status].cls];
    return `<article class="card sc${s.self ? ' on' : s.freed ? ' freed' : ''}"><div class="h"><span class="eyebrow">P${i.priority} · ${esc(i.area)}</span><span class="badge sm ${lab[1]}">${lab[0]}</span></div><h3>${esc(i.title)}</h3>
      <p>${esc((s.self ? i.scenario.success : i.scenario.failure) || '관리 화면의 보고용 시나리오를 입력하세요.')}</p>
      ${i.impact.text ? `<div class="imp">${esc(i.impact.text)}</div>` : ''}
      ${s.deps.length ? `<p class="dep" style="color:${s.blockedBy.length ? 'var(--violet)' : 'var(--green)'}">${s.blockedBy.length ? `${I.lock} 선행 조건 남음: ${s.blockedBy.map(d => esc(d.title)).join(', ')}` : `✓ 선행 조건(${s.deps.map(d => esc(d.title)).join(', ')}) 해소 가정 → 연계 범위 진행 가능`}</p>` : ''}
      <button class="link" data-open="${i.id}" style="align-self:flex-start">관리 내용 확인</button></article>`; };
  const key = sorted(doc.issues).filter(i => i.steps.length && i.scenario.success && i.scenario.failure).slice(0, 2);
  return `<div class="scn-top"><div><span class="eyebrow">WHAT IF · 실제 상태와 분리</span><h2>선행 조건이 해소되면 무엇이 달라질까요?</h2><p>해소할 조건을 고르면 영향과 남는 제약을 바로 비교합니다. 가정은 실제 이슈 상태와 QA 건수를 바꾸지 않습니다.</p></div><button class="btn" id="b-reset-assume" ${n ? '' : 'disabled'}>가정 초기화</button></div>
    ${key.length ? `<div class="scards">${key.map(i => `<section class="card sc"><div class="h"><span class="eyebrow">${I.diamond('var(--navy)')}핵심 게이트 · P${i.priority}</span>${badge(i.status, true)}</div><h3>${esc(i.title)}</h3>${stepsHTML(i, false)}<div class="split"><div style="background:var(--green1);border:1px solid var(--green2)"><b style="color:var(--green)">✓ 해소 시</b>${esc(i.scenario.success)}</div><div style="background:var(--red1);border:1px solid var(--red2)"><b style="color:var(--red)">✕ 해소되지 않을 때</b>${esc(i.scenario.failure)}</div></div></section>`).join('')}</div>` : ''}
    <div class="scn"><aside class="card assume"><h3>해소 조건 선택</h3>
      ${sorted(doc.issues).map(i => `<label class="as"><input type="checkbox" data-assume="${i.id}" ${i.status === 'resolved' || ui.assume[i.id] ? 'checked' : ''} ${i.status === 'resolved' ? 'disabled' : ''}><span><b>P${i.priority} · ${esc(i.title)}</b><small>실제 상태 ${badge(i.status, true)}</small></span></label>`).join('')}</aside>
      <div style="display:flex;flex-direction:column;gap:16px;min-width:0">
        <div class="card scn-sum"><b>${n}개 조건 해소 가정</b><span class="badge b-blue">선행 조건이 풀리는 이슈 ${freed.length}</span><span class="badge b-red">남는 차단 ${remain.length}</span><span class="caption">영향 TC는 중복·추가 환경 확인 후 QA가 재분류합니다</span></div>
        <div class="scards three">${sorted(doc.issues).map(i => card(st.find(s => s.i.id === i.id))).join('')}</div></div></div>`;
}
function reportRequests() {
  const parties = {};
  doc.issues.forEach(i => i.requests.forEach(r => { const p = r.party || '상대 미정'; (parties[p] = parties[p] || []).push({ r, i }); }));
  const names = Object.keys(parties).sort((a, b) => parties[b].filter(x => x.r.state !== 'done').length - parties[a].filter(x => x.r.state !== 'done').length);
  if (!names.length) return `<div class="card empty"><b>확인 요청이 없습니다</b>관리 화면의 이슈 인스펙터 '확인 요청' 탭에서 추가하세요.</div>`;
  return `<div class="scards" style="align-items:start">${names.map(p => { const list = parties[p], open = list.filter(x => x.r.state !== 'done');
    return `<section class="card party"><div class="party-h"><h3>${esc(p)}<span class="count">${open.length}</span></h3><button class="btn sm" data-copy="${esc(p)}" ${open.length ? '' : 'disabled'}>요청 문안 복사</button></div>
      ${list.map(({ r, i }) => `<div class="preq"><button class="stbtn ${r.state}" data-rreq="${r.id}" data-issue="${i.id}">${REQ[r.state]}</button><div><p>${esc(r.text)}</p><small>P${i.priority} · ${esc(i.title)}${r.at ? ' · ' + esc(r.at) : ''}</small></div></div>`).join('')}</section>`; }).join('')}</div>`;
}
function bindReport() {
  ['summary', 'scenario', 'requests'].forEach(k => { const b = $('#rt-' + k); if (b) b.onclick = () => { ui.rtab = k; persistUI(); render(); }; });
  const pr = $('#b-print'); if (pr) pr.onclick = () => window.print();
  $$('[data-open]').forEach(b => b.onclick = () => select(b.dataset.open, 'manage'));
  const rc = $('#r-canvas'); if (rc) drawCanvas(rc, true);
  $$('[data-assume]').forEach(c => c.onchange = () => { ui.assume[c.dataset.assume] = c.checked; const y = window.scrollY; render(); window.scrollTo(0, y); });
  const ra = $('#b-reset-assume'); if (ra) ra.onclick = () => { ui.assume = {}; const y = window.scrollY; render(); window.scrollTo(0, y); };
  $$('[data-rreq]').forEach(b => b.onclick = () => { const i = issueById(b.dataset.issue), r = i.requests.find(x => x.id === b.dataset.rreq), order = ['open', 'answered', 'done']; const nx = order[(order.indexOf(r.state) + 1) % 3]; r.state = nx; r.at = nx === 'open' ? '' : `${REQ[nx]} ${new Date().toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })}`; i.updatedAt = new Date().toISOString(); persist(); const y = window.scrollY; render(); window.scrollTo(0, y); });
  $$('[data-copy]').forEach(b => b.onclick = () => {
    const p = b.dataset.copy, list = [];
    doc.issues.forEach(i => i.requests.forEach(r => { if ((r.party || '상대 미정') === p && r.state !== 'done') list.push({ r, i }); }));
    const byIssue = {}; list.forEach(x => (byIssue[x.i.title] = byIssue[x.i.title] || []).push(x.r.text));
    const txt = `[${doc.title}] ${p} 확인 요청 (${doc.asOf} 기준)\n\n` + Object.entries(byIssue).map(([t, qs]) => `■ ${t}\n` + qs.map((q, n) => `  ${n + 1}. ${q}`).join('\n')).join('\n\n') + `\n\n회신 가능한 일정도 함께 알려주시면 다음 점검에 반영하겠습니다.`;
    copyText(txt, `${p} 요청 문안`);
  });
}

/* ================= 모달 / 토스트 / 파일 ================= */
function openModal(title, body, o = {}) {
  const root = $('#modal-root'); const prev = document.activeElement;
  root.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="dlg${o.narrow ? ' narrow' : ''}"><div class="dlg-h"><h2>${esc(title)}</h2><button class="btn sm" data-close>닫기</button></div>${o.stepper || ''}<div class="dlg-b">${body}</div>${o.foot ? `<div class="dlg-f">${o.foot}</div>` : ''}</div></div>`;
  const close = () => { root.innerHTML = ''; document.removeEventListener('keydown', onKey, true); if (prev && prev.focus) prev.focus(); };
  const onKey = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } if (e.key === 'Tab') { const f = $$('button:not(:disabled),input:not([hidden]),select,textarea,[tabindex="0"]', root).filter(x => x.offsetParent); if (!f.length) return; const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } } };
  document.addEventListener('keydown', onKey, true);
  $('[data-close]', root).onclick = close;
  $('.modal', root).onmousedown = e => { if (e.target.classList.contains('modal')) close(); };
  setTimeout(() => { const f = $(o.focus || '[data-close]', root); if (f) f.focus(); }, 0);
  return { root, close };
}
function toast(msg, action) {
  const root = $('#toast-root');
  root.innerHTML = `<div class="toast${action ? '' : ' solo'}" role="status"><span>${esc(msg)}</span>${action ? `<button id="toast-act">${esc(action.label)}</button>` : ''}</div>`;
  if (action) $('#toast-act').onclick = () => { root.innerHTML = ''; action.fn(); };
  clearTimeout(toast.t); toast.t = setTimeout(() => root.innerHTML = '', action ? 7000 : 2800);
}
async function copyText(txt, label) {
  try { await navigator.clipboard.writeText(txt); toast(`${label}을 복사했습니다`); }
  catch (e) { const m = openModal(label, `<p class="caption">자동 복사가 막혀 있어 아래 내용을 선택해 두었습니다. 복사(⌘C / Ctrl+C)해 사용하세요.</p><textarea class="textarea" id="copy-area" rows="12" readonly>${esc(txt)}</textarea>`, { narrow: true, focus: '#copy-area' }); setTimeout(() => $('#copy-area') && $('#copy-area').select(), 10); }
}
async function saveFile() {
  const name = `${doc.title.replace(/[\\/:*?"<>|]/g, '_').slice(0, 60) || 'issues'}.mapstone-issues.json`;
  const data = JSON.stringify({ ...doc, updatedAt: new Date().toISOString() }, null, 2);
  if (downloadsFn) { try { const r = await downloadsFn.save({ filename: name, data }); toast(r && r.status === 'delivered' ? '파일을 전달했습니다' : `${name} 파일로 저장했습니다`); return; } catch (e) { if (e && e.code === 'declined') return; copyText(data, '문서 JSON'); return; } }
  if (window.top !== window) { copyText(data, '문서 JSON'); return; }
  try { const u = URL.createObjectURL(new Blob([data], { type: 'application/json' })); const a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 2000); toast(`${name} 파일로 저장했습니다`); }
  catch (e) { copyText(data, '문서 JSON'); }
}

/* ================= QA 분류 편집 ================= */
function openQA() {
  let rows = doc.metrics.map(m => ({ ...m }));
  const draw = () => {
    const w = metricWarnings(rows);
    $('#qa-body').innerHTML = `<p class="caption">QA 사전 수행 분류입니다. 실제 테스트 결과(Pass/Fail)가 아닙니다. 전체 = N/T + 제한적 + 기타가 맞아야 반영됩니다.</p>
      <div class="tw"><table><thead><tr><th style="min-width:150px">영역</th><th class="n">전체</th><th class="n">N/T</th><th class="n">제한적</th><th class="n">기타</th><th></th></tr></thead><tbody>
      ${rows.map((r, n) => `<tr><td><input class="input sm" data-qr="${n}" data-qk="label" value="${esc(r.label)}" aria-label="영역 이름"></td>${['total', 'blocked', 'limited', 'other'].map(k => `<td><input class="input sm num" type="number" min="0" style="width:84px;text-align:right" data-qr="${n}" data-qk="${k}" value="${r[k]}" aria-label="${k}"></td>`).join('')}<td><button class="btn sm ghost danger" data-qdel="${n}">삭제</button></td></tr>`).join('')}</tbody></table></div>
      <div><button class="btn sm" id="qa-add">${I.plus}영역 추가</button></div>${w.map(x => `<div class="err">${esc(x)}</div>`).join('')}`;
    $$('[data-qr]').forEach(inp => inp.oninput = () => { const r = rows[+inp.dataset.qr], k = inp.dataset.qk; r[k] = k === 'label' ? inp.value : Math.max(0, Math.floor(+inp.value || 0)); const ok = !metricWarnings(rows).length && rows.every(r => r.label.trim()); $('#qa-save').disabled = !ok; const errs = $$('#qa-body .err'); errs.forEach(e => e.remove()); metricWarnings(rows).forEach(x => $('#qa-body').insertAdjacentHTML('beforeend', `<div class="err">${esc(x)}</div>`)); });
    $$('[data-qdel]').forEach(b => b.onclick = () => { rows.splice(+b.dataset.qdel, 1); draw(); });
    $('#qa-add').onclick = () => { rows.push({ label: '', total: 0, blocked: 0, limited: 0, other: 0 }); draw(); const ins = $$('[data-qk="label"]'); ins[ins.length - 1].focus(); };
    $('#qa-save').disabled = !!w.length || rows.some(r => !r.label.trim());
  };
  const m = openModal('QA 수행 가능 분류 편집', `<div id="qa-body" style="display:flex;flex-direction:column;gap:12px"></div>`, { narrow: true, foot: `<span class="status">전체 = N/T + 제한적 + 기타</span><button class="btn" data-close2>취소</button><button class="btn primary" id="qa-save">분류 반영</button>` });
  draw();
  $('[data-close2]').onclick = m.close;
  $('#qa-save').onclick = () => { mutate(d => d.metrics = rows.map(r => ({ ...r, label: r.label.trim() })), { undo: 'QA 분류 편집', parts: ['strip', 'blocks'], toast: 'QA 수행 가능 분류를 반영했습니다' }); m.close(); };
}

/* ================= 이슈 텍스트 입력 ================= */
function openImport() {
  let step = 1, draft = null, how = '', engine = sampleFn ? 'ai' : 'rule', src = '', title = '', asOf = '', asOfHow = '', ask = null, askPick = '', askCustom = '', strategy = 'replace', busy = false, ctrl = null;
  try { src = localStorage.getItem(STORE + '.draft') || ''; } catch (e) { }
  const m = openModal('이슈 텍스트 입력', `<div id="im"></div>`, { stepper: '<div class="stepper" id="im-steps"></div>', foot: '<span class="status" id="im-status"></span><span id="im-actions" style="display:flex;gap:8px"></span>', focus: '#im-src' });
  const paintSteps = () => { const sn = step === 'ask' ? 1 : step; $('#im-steps').innerHTML = [['1', '원문 입력'], ['2', '정리 초안 검토'], ['3', '관리 화면에 반영']].map(([n, l], k) => `<span class="${k + 1 === sn ? 'on' : k + 1 < sn ? 'ok' : ''}">${k + 1 < sn ? '✓' : n}<span class="lbl"> · ${l}</span></span>`).join(''); };
  const draw = () => {
    paintSteps();
    const box = $('#im'), act = $('#im-actions'), st = $('#im-status');
    if (step === 1) {
      box.innerHTML = `<div style="display:flex;flex-direction:column;gap:14px">
        <div class="pair im-pair"><div class="field"><label for="im-title">문서 제목<small>비우면 원문 첫 문장에서 추출</small></label><input class="input" id="im-title" value="${esc(title)}" placeholder="예: 2차 DVT 진입 점검" maxlength="150"></div>
          <div class="field"><label for="im-asof">보고 기준일<small>비우면 원문에서 판단</small></label><input class="input" type="date" id="im-asof" value="${asOf}"></div></div>
        ${sampleFn ? `<div class="field"><span class="label">정리 방식</span><div class="seg" role="group" aria-label="정리 방식" style="align-self:flex-start"><button id="im-ai" aria-pressed="${engine === 'ai'}">Claude 분석</button><button id="im-rule" aria-pressed="${engine === 'rule'}">규칙 기반 (로컬)</button></div></div>` : ''}
        <div class="field"><label for="im-src">이슈 원문<small id="im-count">${src.length.toLocaleString()} / 100,000자</small></label><textarea class="textarea src" id="im-src" maxlength="100000" placeholder="이슈가 정리된 글을 그대로 붙여 넣으세요. 표는 탭으로 구분된 상태 그대로 붙여 넣으면 됩니다.">${esc(src)}</textarea></div>
        <div class="tools"><button class="btn sm" id="im-ex">제공한 DVT 예제 채우기</button><button class="btn sm" id="im-file">텍스트 · JSON 파일 열기</button><button class="btn sm ghost" id="im-clear">비우기</button><input type="file" id="im-fin" accept=".txt,.md,.json" hidden></div>
        <p class="disclose">${engine === 'ai' ? 'Claude가 원문을 읽고 이슈·이력·확인 요청·시나리오로 정리합니다. 처음 쓸 때 사용 허용을 묻고, 1~2분 걸릴 수 있습니다. 결과는 반영 전에 검토합니다.' : '로컬 규칙 기반 정리입니다. 원문은 외부로 보내지 않습니다. 표·날짜·번호 목록을 읽으며 복잡한 인과관계는 초안에서 확인해야 합니다.'}</p></div>`;
      st.textContent = '날짜·담당이 원문에 없으면 비워 두고 확인 필요로 표시합니다.';
      act.innerHTML = `<button class="btn" id="im-cancel">취소</button><button class="btn primary" id="im-run">${busy ? '정리하는 중…' : '텍스트 정리하기'}</button>`;
      const ta = $('#im-src');
      const sync = () => { src = ta.value; $('#im-count').textContent = `${src.length.toLocaleString()} / 100,000자`; $('#im-run').disabled = busy || src.trim().length < 12; try { localStorage.setItem(STORE + '.draft', src); } catch (e) { } };
      ta.oninput = sync; sync();
      $('#im-title').oninput = e => title = e.target.value;
      $('#im-asof').onchange = e => { asOf = isDate(e.target.value) ? e.target.value : ''; asOfHow = asOf ? '직접 입력' : ''; };
      if ($('#im-ai')) { $('#im-ai').onclick = () => { engine = 'ai'; draw(); }; $('#im-rule').onclick = () => { engine = 'rule'; draw(); }; }
      $('#im-ex').onclick = () => { src = ($('#sample-text') || {}).textContent.trim(); title = '27CY SU#2 · 2차 DVT 진입 점검'; asOf = ''; asOfHow = ''; draw(); };
      $('#im-clear').onclick = () => { src = ''; draw(); $('#im-src').focus(); };
      $('#im-file').onclick = () => $('#im-fin').click();
      $('#im-fin').onchange = async e => {
        const f = e.target.files[0]; e.target.value = ''; if (!f) return;
        try { if (f.size > 1.5e6) throw new Error('1.5MB 이하 파일을 선택하세요.'); const t = await f.text();
          if (/\.json$/i.test(f.name)) { draft = normalizeDoc(JSON.parse(t)); how = '파일 불러오기'; step = 2; draw(); }
          else { src = t; draw(); } }
        catch (err) { st.innerHTML = `<span style="color:var(--red);font-weight:600">파일을 읽지 못했습니다: ${esc(err.message)}</span>`; }
      };
      $('#im-cancel').onclick = () => { if (ctrl) ctrl.abort(); m.close(); };
      $('#im-run').onclick = run;
    } else if (step === 'ask') {
      // 원문 속 '금일·오전' 등은 입력한 날이 아닐 수 있어 보고 기준일을 먼저 묻는다
      const today = todayISO(), opts = [];
      if (ask.basis) opts.push([ask.basis, '원문에 적힌 기준일', `“${ask.basisText}” 문구`]);
      if (ask.latest && ask.latest !== ask.basis) opts.push([ask.latest, '원문의 가장 늦은 날짜', '본문에 나온 날짜 중 마지막']);
      if (!opts.some(o => o[0] === today)) opts.push([today, '오늘 (텍스트 입력일)', '방금 작성한 보고라면']);
      if (!askPick) askPick = opts[0][0];
      const hl = t => esc(t).replace(/(금일|오늘|당일|오전|오후|어제|전일|내일|익일|명일|모레|금주|이번 주|지난주|다음 주|차주)/g, '<mark>$1</mark>');
      box.innerHTML = `<div class="im-ask"><h3>${ask.rel.length ? `원문의 ‘${[...new Set(ask.rel.flatMap(x => x.words))].slice(0, 3).join('·')}’은 언제인가요?` : '이 보고는 언제 기준인가요?'}</h3>
        <p class="caption">${ask.rel.length ? '붙여 넣은 보고서가 오늘 쓴 글이 아닐 수 있습니다. 상대 날짜를 어느 날짜로 해석할지 골라 주세요. 고른 날짜가 보고 기준일이 되고, NOW는 오늘로 따로 표시됩니다.' : '원문에서 날짜를 찾지 못했습니다. 보고 기준일을 정해 주세요.'}</p>
        ${ask.rel.length ? `<ul class="im-snips">${ask.rel.slice(0, 4).map(x => `<li>${hl(x.snippet)}</li>`).join('')}${ask.rel.length > 4 ? `<li class="more">외 ${ask.rel.length - 4}곳</li>` : ''}</ul>` : ''}
        <fieldset class="radio"><legend>보고 기준일</legend>
          ${opts.map(([d, l, sub]) => `<label><input type="radio" name="im-ask" value="${d}" ${askPick === d ? 'checked' : ''}><span>${l} · <b>${dl(d)} (${wd(d)})</b><small>${esc(sub)}</small></span></label>`).join('')}
          <label><input type="radio" name="im-ask" value="custom" ${askPick === 'custom' ? 'checked' : ''}><span>직접 선택<small><input class="input sm" type="date" id="im-ask-d" value="${askCustom || today}" aria-label="보고 기준일 직접 선택"></small></span></label></fieldset></div>`;
      st.textContent = '고른 날짜는 정리 후 관리 화면의 보고 기준일에서 바꿀 수 있습니다.';
      act.innerHTML = `<button class="btn" id="im-back">원문 다시 수정</button><button class="btn primary" id="im-ask-ok">이 날짜로 정리하기</button>`;
      $$('[name=im-ask]').forEach(x => x.onchange = () => { askPick = x.value; });
      $('#im-ask-d').oninput = e => { askCustom = e.target.value; askPick = 'custom'; $('[name=im-ask][value=custom]').checked = true; };
      $('#im-ask-d').onclick = () => { askPick = 'custom'; $('[name=im-ask][value=custom]').checked = true; };
      $('#im-back').onclick = () => { step = 1; draw(); };
      $('#im-ask-ok').onclick = () => {
        const v = askPick === 'custom' ? (askCustom || $('#im-ask-d').value) : askPick; if (!isDate(v)) return;
        asOf = v; asOfHow = askPick === 'custom' ? '직접 선택' : (opts.find(o => o[0] === v) || [, '선택'])[1]; step = 1; run();
      };
    } else {
      const d = draft, ev = d.issues.reduce((a, i) => a + i.events.length, 0), rq = d.issues.reduce((a, i) => a + i.requests.length, 0);
      box.innerHTML = `<div class="rv-sum"><div><h3>${esc(d.title)}</h3><div class="stats"><span class="badge b-blue">이슈 ${d.issues.length}</span><span class="badge b-slate">이력 ${ev}</span><span class="badge b-slate">확인 요청 ${rq}</span><span class="badge b-slate">TC 분류 ${d.metrics.length}개 영역</span><span class="badge b-slate">보고 기준일 ${d.asOf}${asOfHow ? ` · ${esc(asOfHow)}` : ''}</span></div></div><span class="badge b-violet">${esc(how)}</span></div>
        ${d.asOf < todayISO() ? `<p class="caption im-lag">보고 기준일(${dl(d.asOf)})이 오늘보다 ${diffD(d.asOf, todayISO())}일 전입니다. 반영하면 NOW는 오늘(${dl(todayISO())})로 표시되고, 그 사이 지난 점검일·예정 이력은 결과 확인 대상으로 보입니다.</p>` : ''}
        <p class="qnote">자동 정리 초안입니다. 제목·상태·담당·완료 조건을 확인한 뒤 반영하세요. 반영 후에도 모두 수정할 수 있고, 원문도 함께 보존됩니다.</p>
        <div class="rv-list">${sorted(d.issues).map(i => `<article class="rv"><div class="rv-h"><span class="eyebrow"><b style="color:var(--navy7)">P${i.priority}</b><span>·</span><span>${esc(i.area)}</span></span><span class="caption">이력 ${i.events.length} · 요청 ${i.requests.length} · 조치 ${i.actions.length}</span><button class="btn sm ghost danger" data-rvdel="${i.id}">제외</button></div>
          <div class="grid"><div class="field"><label for="rv-t-${i.id}">이슈 제목</label><input class="input sm" id="rv-t-${i.id}" data-rv="${i.id}" data-k="title" value="${esc(i.title)}"></div>
            <div class="field"><label for="rv-s-${i.id}">상태</label><select class="select sm" id="rv-s-${i.id}" data-rv="${i.id}" data-k="status">${Object.entries(STATUS).map(([k, s]) => `<option value="${k}" ${k === i.status ? 'selected' : ''}>${s.label}</option>`).join('')}</select></div>
            <div class="field"><label for="rv-p-${i.id}">우선</label><select class="select sm" id="rv-p-${i.id}" data-rv="${i.id}" data-k="priority">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<option ${n === i.priority ? 'selected' : ''} value="${n}">P${n}</option>`).join('')}</select></div></div>
          <div class="grid2"><div class="field"><label for="rv-o-${i.id}">담당 / 관련 부문</label><input class="input sm" id="rv-o-${i.id}" data-rv="${i.id}" data-k="owner" value="${esc(i.owner)}" placeholder="담당 확인 필요"></div>
            <div class="field"><label for="rv-g-${i.id}">완료 조건</label><input class="input sm" id="rv-g-${i.id}" data-rv="${i.id}" data-k="gate" value="${esc(i.gate)}"></div></div>
          ${i.summary ? `<p class="caption">${esc(clip(i.summary, 200))}</p>` : ''}</article>`).join('') || '<div class="empty"><b>정리된 이슈가 없습니다</b>원문으로 돌아가 내용을 확인하세요.</div>'}</div>
        <fieldset class="radio"><legend>반영 방식</legend>
          <label><input type="radio" name="im-st" value="replace" ${strategy === 'replace' ? 'checked' : ''}><span>새 관리 문서로 반영<small>현재 문서를 바꿉니다. 되돌리기로 복구할 수 있습니다.</small></span></label>
          <label><input type="radio" name="im-st" value="append" ${strategy === 'append' ? 'checked' : ''}><span>현재 문서에 이슈 추가<small>현재 QA 분류·기준일·종합 의견은 유지합니다.</small></span></label></fieldset>`;
      st.textContent = '반영하면 관리 화면에서 바로 담당·점검을 이어서 관리할 수 있습니다.';
      act.innerHTML = `<button class="btn" id="im-back">원문 다시 수정</button><button class="btn primary" id="im-apply" ${d.issues.length && d.issues.every(i => i.title.trim()) ? '' : 'disabled'}>관리 화면에 반영</button>`;
      $$('[data-rv]').forEach(inp => { const h = () => { const i = d.issues.find(x => x.id === inp.dataset.rv), k = inp.dataset.k; i[k] = k === 'priority' ? +inp.value : inp.value; $('#im-apply').disabled = !d.issues.length || d.issues.some(x => !x.title.trim()); }; inp.oninput = h; inp.onchange = h; });
      $$('[data-rvdel]').forEach(b => b.onclick = () => { d.issues = d.issues.filter(x => x.id !== b.dataset.rvdel); d.issues.forEach(x => x.dependsOn = x.dependsOn.filter(y => y !== b.dataset.rvdel)); draw(); });
      $$('[name=im-st]').forEach(r => r.onchange = () => strategy = r.value);
      $('#im-back').onclick = () => { step = 1; if (asOfHow !== '직접 입력') { asOf = ''; asOfHow = ''; } draw(); };
      $('#im-apply').onclick = () => { apply(); };
    }
  };
  async function run() {
    if (busy || src.trim().length < 12) return;
    if (!isDate(asOf)) {
      const c = dateContext(src);
      if (c.rel.length || !c.hasDates) { ask = c; askPick = ''; step = 'ask'; draw(); return; }
      asOf = c.basis || c.latest; asOfHow = c.basis ? `원문 “${c.basisText}”` : '원문 최신 날짜';
    }
    busy = true; draw(); const st = $('#im-status');
    try {
      let raw;
      if (engine === 'ai' && sampleFn) {
        st.textContent = 'Claude가 원문을 읽는 중입니다…'; ctrl = new AbortController();
        try {
          const res = await sampleFn(claudePrompt(src, { title, asOf }), { modelTier: 'complex', signal: ctrl.signal, onText: ({ text }) => { const s = $('#im-status'); if (s) s.textContent = `Claude가 정리하는 중… ${text.length.toLocaleString()}자`; } });
          let t = res.text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, ''); const a = t.indexOf('{'), b = t.lastIndexOf('}');
          raw = JSON.parse(t.slice(a, b + 1)); raw.source = src; how = 'Claude 분석';
        } catch (err) {
          if (err && err.name === 'AbortError') { busy = false; return; }
          if (err && err.code === 'not_granted') sampleFn = null;
          raw = parseRules(src, { title, asOf }); how = `규칙 기반 (Claude 실패: ${(err && (err.code || err.message)) || '오류'})`;
        }
      } else { raw = parseRules(src, { title, asOf }); how = '규칙 기반 정리'; }
      if (title.trim()) raw.title = title.trim();
      if (isDate(asOf)) raw.asOf = asOf;
      draft = normalizeDoc(raw); step = 2;
    } catch (err) { busy = false; draw(); $('#im-status').innerHTML = `<span style="color:var(--red);font-weight:600">${esc(err.message || '정리하지 못했습니다.')}</span>`; return; }
    busy = false; draw();
  }
  function apply() {
    const d = draft; if (!d) return;
    if (strategy === 'append') {
      if (doc.issues.length + d.issues.length > 150) { $('#im-status').innerHTML = '<span style="color:var(--red);font-weight:600">문서당 150개 이슈까지 관리합니다. 새 문서로 반영하세요.</span>'; return; }
      mutate(x => { x.issues.push(...d.issues); d.groupOrder.forEach(g => { if (!x.groupOrder.includes(g)) x.groupOrder.push(g); }); x.source = (x.source ? x.source + '\n\n[추가 원문]\n' : '') + (d.source || ''); x.notes = [...new Set([...x.notes, ...d.notes])]; }, { undo: '이슈 텍스트 추가 반영', parts: [] });
    } else {
      snapshot('이슈 텍스트 반영'); doc = d; doc.example = false; persist();
    }
    ui.sel = (sorted(d.issues)[0] || {}).id || null; ui.view = 'manage'; ui.itab = 'manage'; ui.q = ''; ui.fStatus = 'all'; ui.fGroup = 'all'; ui.fGap = ''; ui.hideResolved = false; ui.scrollX = null; ui.assume = {};
    try { localStorage.removeItem(STORE + '.draft'); } catch (e) { }
    m.close(); render(); window.scrollTo(0, 0);
    toast(`${d.issues.length}개 이슈를 반영했습니다. 담당·점검일을 이어서 관리하세요.`, { label: '되돌리기', fn: undo });
  }
  draw();
}

/* ================= 부팅 ================= */
load();
render();
// 마일스톤 모드에서 미리 준비(prerender)됐다가 실제로 열리면 최신 저장본으로 다시 그림
if (document.prerendering) document.addEventListener('prerenderingchange', () => { load(); render(); }, { once: true });
let rz, lastW = window.innerWidth;
window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (Math.abs(window.innerWidth - lastW) < 2) return; lastW = window.innerWidth; if (ui.view === 'manage') refresh(['canvas']); else { const rc = $('#r-canvas'); if (rc) drawCanvas(rc, true); } }, 150); });
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey && !e.target.closest('input,textarea,select') && !$('#modal-root').innerHTML) { e.preventDefault(); undo(); }
});
(async () => {
  try { if (window.claude && window.claude.use) { const [s, d] = await Promise.all([window.claude.use('sample'), window.claude.use('downloads')]); sampleFn = s; downloadsFn = d; } } catch (e) { }
})();
