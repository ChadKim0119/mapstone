/* ================= 공통 유틸 ================= */
const uid = () => 'x' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-3);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const isDate = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s + 'T00:00:00Z'));
const parseD = s => { const [y, m, d] = s.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)); };
const fmtD = d => d.toISOString().slice(0, 10);
const addD = (s, n) => { const d = parseD(s); d.setUTCDate(d.getUTCDate() + n); return fmtD(d); };
const diffD = (a, b) => Math.round((parseD(b) - parseD(a)) / 864e5);
const dl = s => s ? `${s.slice(5, 7)}.${s.slice(8, 10)}` : '';
const WD = '일월화수목금토';
const wd = s => WD[parseD(s).getUTCDay()];
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const clip = (t, n) => { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
const pct = (n, t) => t ? n / t * 100 : 0;
const pctS = (n, t) => t ? (n / t * 100).toFixed(1) + '%' : '—';

const STATUS = {
  blocked: { label: '차단', cls: 'b-red', color: 'var(--red)' },
  progress: { label: '진행 중', cls: 'b-blue', color: 'var(--blue)' },
  pending: { label: '확인 대기', cls: 'b-amber', color: 'var(--amberline)' },
  resolved: { label: '해결', cls: 'b-green', color: 'var(--green)' }
};
const KIND = {
  fact: { label: '확인', color: 'var(--blue)', ink: 'var(--blue7)' },
  fail: { label: '실패·오류', color: 'var(--red)', ink: 'var(--red)' },
  ok: { label: '정상', color: 'var(--green)', ink: 'var(--green)' },
  warn: { label: '정정·지연', color: 'var(--amberline)', ink: 'var(--amber)' },
  plan: { label: '예정', color: 'var(--slate)', ink: 'var(--slate6)' }
};
const REQ = { open: '회신 대기', answered: '회신 받음', done: '확인 완료' };
const STEP = { todo: '대기', current: '진행', done: '완료', fail: '실패' };
const GROUP_COLORS = ['#234770', '#087F95', '#6D5CCE', '#5E7694', '#2959AF', '#147447', '#805400', '#9A3E6B'];

/* ================= 정규화 / 검증 ================= */
function normalizeDoc(raw) {
  if (!raw || typeof raw !== 'object') throw new Error('문서 형식이 올바르지 않습니다.');
  const A = x => Array.isArray(x) ? x : [];
  const S = (x, n = 2000) => String(x ?? '').slice(0, n);
  const N = x => (x === '' || x === null || x === undefined || isNaN(+x)) ? null : Math.max(0, Math.min(1e7, Math.floor(+x)));
  const asOf = isDate(raw.asOf) ? raw.asOf : todayISO();
  const issues = A(raw.issues).slice(0, 150).map((r, n) => {
    const i = {
      id: S(r.id || '', 60) || uid(), key: S(r.key || '', 20), title: S(r.title || '새 이슈', 200).trim() || '새 이슈',
      group: S(r.group || r.area || '미분류', 60).trim() || '미분류', area: S(r.area || r.group || '미분류', 60).trim() || '미분류',
      priority: Math.max(1, Math.min(9, Math.floor(+r.priority) || n + 1)), status: STATUS[r.status] ? r.status : 'pending',
      owner: S(r.owner, 200), checkDate: isDate(r.checkDate) ? r.checkDate : '', summary: S(r.summary, 2000), gate: S(r.gate, 2000),
      impact: { count: N(r.impact && r.impact.count), unit: (r.impact && r.impact.unit) === 'API' ? 'API' : 'TC', text: S(r.impact && r.impact.text, 500) },
      constraint: r.constraint && r.constraint.text ? { text: S(r.constraint.text, 300), start: isDate(r.constraint.start) ? r.constraint.start : '', tone: r.constraint.tone === 'amber' ? 'amber' : 'red' } : null,
      steps: A(r.steps).slice(0, 8).map(s => Array.isArray(s) ? [S(s[0], 40) || '단계', STEP[s[1]] ? s[1] : 'todo'] : [S(s.label || s, 40) || '단계', STEP[s.state] ? s.state : 'todo']),
      dependsOn: A(r.dependsOn).map(x => S(x, 60)),
      actions: A(r.actions).slice(0, 100).map(a => typeof a === 'string' ? { id: uid(), text: S(a, 500), done: false } : { id: S(a.id, 60) || uid(), text: S(a.text, 500), done: !!a.done }).filter(a => a.text.trim()),
      events: A(r.events).slice(0, 300).map(e => ({ id: S(e.id, 60) || uid(), date: isDate(e.date) ? e.date : '', kind: KIND[e.kind] ? e.kind : 'fact', text: S(e.text, 1000), flag: ['*', '~'].includes(e.flag) ? e.flag : '', corrected: !!e.corrected, evidence: S(e.evidence, 2000) })).filter(e => e.text.trim()),
      requests: A(r.requests).slice(0, 100).map(q => ({ id: S(q.id, 60) || uid(), party: S(q.party, 100), text: S(q.text, 1000), state: REQ[q.state] ? q.state : 'open', at: S(q.at, 40) })).filter(q => q.text.trim()),
      notes: A(r.notes).slice(0, 1000).map(x => ({ at: S(x.at, 40) || new Date().toISOString(), text: S(x.text, 5000), sys: !!x.sys })).filter(x => x.text.trim()),
      scenario: { success: S(r.scenario && r.scenario.success, 1500), failure: S(r.scenario && r.scenario.failure, 1500) },
      evidence: A(r.evidence).slice(0, 60).map(x => S(x, 1500)).filter(Boolean),
      updatedAt: S(r.updatedAt, 40) || new Date().toISOString()
    };
    return i;
  });
  // dependsOn: key → id
  const byKey = new Map(issues.filter(i => i.key).map(i => [i.key.toUpperCase(), i.id]));
  const ids = new Set(issues.map(i => i.id));
  issues.forEach(i => { i.dependsOn = [...new Set(i.dependsOn.map(d => ids.has(d) ? d : byKey.get(d.toUpperCase())).filter(d => d && d !== i.id))]; });
  const groups = [...new Set(issues.map(i => i.group))];
  const metrics = A(raw.metrics).slice(0, 50).map(m => ({ label: S(m.label, 100).trim(), total: N(m.total) || 0, blocked: N(m.blocked) || 0, limited: N(m.limited) || 0, other: N(m.other) || 0 })).filter(m => m.label && !/합계|total/i.test(m.label));
  const R = raw.reasons;
  const reasons = R && A(R.rows).length ? { title: S(R.title || 'N/T 사유', 80), rows: A(R.rows).map(r => ({ label: S(r.label, 120), count: N(r.count) || 0, action: S(r.action, 200), key: S(r.key, 20) })).filter(r => r.label && !/합계|집계/.test(r.label)), reported: N(R.reported) || 0, note: S(R.note, 300) } : null;
  const C = raw.conclusion || {};
  return {
    schema: 2, title: S(raw.title || '이슈 현황', 200), subtitle: S(raw.subtitle, 300), asOf, example: !!raw.example,
    now: isDate(raw.now) ? raw.now : todayISO(), nowManual: !!raw.nowManual && isDate(raw.now),
    groupOrder: A(raw.groupOrder).filter(g => groups.includes(g)).concat(groups.filter(g => !A(raw.groupOrder).includes(g))),
    issues, metrics, reasons, notes: A(raw.notes).map(x => S(x, 500)).filter(Boolean).slice(0, 30),
    conclusion: { points: A(C.points).slice(0, 6).map(p => ({ title: S(p.title, 200), body: S(p.body, 1200) })).filter(p => p.title), summary: S(C.summary, 800) },
    source: S(raw.source, 100000), updatedAt: S(raw.updatedAt, 40)
  };
}
function metricTotals(rows) { return rows.reduce((a, r) => ({ total: a.total + r.total, blocked: a.blocked + r.blocked, limited: a.limited + r.limited, other: a.other + r.other }), { total: 0, blocked: 0, limited: 0, other: 0 }); }
function metricWarnings(rows) { return rows.filter(r => r.total !== r.blocked + r.limited + r.other).map(r => `${r.label || '(이름 없음)'}: 전체 ${r.total}건 ≠ N/T+제한적+기타 ${r.blocked + r.limited + r.other}건`); }

/* ================= 날짜 맥락 ================= */
// 상대 날짜 표현과 원문 속 기준일 후보를 찾는다. 상대 표현이 있으면 입력일이 아닐 수 있어 사용자에게 묻는다.
const REL_WORDS = [['금일', 0], ['오늘', 0], ['당일', 0], ['오전', 0], ['오후', 0], ['어제', -1], ['전일', -1], ['내일', 1], ['익일', 1], ['명일', 1], ['모레', 2], ['금주', null], ['이번 주', null], ['지난주', null], ['다음 주', null], ['차주', null]];
function dateContext(src, fallbackYear) {
  const text = String(src || ''), yearM = text.match(/\b(20\d\d)\b/), year = yearM ? +yearM[1] : (fallbackYear || +todayISO().slice(0, 4));
  const iso = (m, d) => { const v = `${year}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`; return isDate(v) ? v : ''; };
  // 한 줄에 여러 표현이 있어도 원문 문장은 한 번만 보여준다
  const rel = [];
  text.split(/\r?\n/).forEach(line => {
    if (rel.length >= 12) return;
    const words = REL_WORDS.map(([w]) => w).filter(w => { const k = line.indexOf(w); if (k < 0) return false; if (w !== '오전' && w !== '오후') return true; return /금일|오늘|당일|\d+시/.test(line) || /^\s*\d/.test(line.slice(k + w.length)); });
    if (!words.length) return;
    const k = Math.min(...words.map(w => line.indexOf(w))), t = line.trim();
    rel.push({ word: words[0], words, snippet: (k > 24 ? '…' + line.slice(k - 18) : t).slice(0, 64) + (t.length > 64 ? '…' : '') });
  });
  let basis = '', basisText = '';
  const bm = text.match(/(\d{1,2})월\s*(\d{1,2})일\s*(?:\([^)]*\)\s*)?(기준|현재)/) || text.match(/(\d{1,2})\/(\d{1,2})\s*(?:\([^)]*\)\s*)?(기준|현재)/);
  if (bm) { basis = iso(bm[1], bm[2]); basisText = bm[0]; }
  const all = []; const re = /(\d{1,2})월\s*(\d{1,2})일|(?:^|[^\d/.])(\d{1,2})\/(\d{1,2})(?![\d/])/g; let m;
  while ((m = re.exec(text))) { const a = m[1] || m[3], b = m[2] || m[4]; if (+a <= 12) { const v = iso(a, b); if (v) all.push(v); } }
  all.sort();
  return { rel, basis, basisText, latest: all[all.length - 1] || '', hasDates: all.length > 0, year };
}

/* ================= 규칙 기반 정리 ================= */
function parseRules(src, opt = {}) {
  const text = String(src || '');
  if (text.trim().length < 12) throw new Error('이슈 내용이 담긴 텍스트를 12자 이상 입력해 주세요.');
  const lines = text.replace(/\r/g, '').split('\n').map(s => s.replace(/ /g, ' ').replace(/^ +| +$/g, '')).filter(s => s.trim());
  const yearM = text.match(/\b(20\d\d)\b/); const year = yearM ? +yearM[1] : +(opt.asOf || todayISO()).slice(0, 4);
  const iso = (m, d) => { const v = `${year}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`; return isDate(v) ? v : ''; };
  const dateIn = s => { let m = s.match(/(\d{1,2})월\s*(\d{1,2})일/); if (m) return iso(m[1], m[2]); m = s.match(/(?:^|[^\d./])(\d{1,2})\/(\d{1,2})(?![\d/])/); if (m && +m[1] <= 12) return iso(m[1], m[2]); return ''; };
  const kindOf = s => /오류|실패|불가|Timeout|파손|미수신|미확보|미구현|미구성/i.test(s) ? 'fail' : /정상|성공|완료/.test(s) ? 'ok' : /정정|추정|지연|변경|안내 오류/.test(s) ? 'warn' : /예정|계획/.test(s) ? 'plan' : 'fact';
  const statusOf = s => /오류|실패|불가|미확보|미구성|미구현|부족|제약|N\/T/i.test(s) ? 'blocked' : /예정|계획|대기/.test(s) ? 'pending' : /진행|전달/.test(s) ? 'progress' : 'pending';
  const cells = l => l.includes('\t') ? l.split('\t').map(s => s.trim()) : l.split(/\s{2,}/).map(s => s.trim());
  const isHeading = l => /^\d+(\.\d+)*\.?\s+\S/.test(l) && !l.includes('\t') && l.length < 80 && !/^\d+\s*(건|개|대)/.test(l);
  const TOK = s => (s.match(/[A-Za-z][A-Za-z0-9#\-]{1,}/g) || []).map(x => x.toUpperCase()).filter(x => !/^(API|TC|N\/T|E2E|LG|U\+|ID|URL|IP|CV|STG|IF|N|T|SU|CY|DVT|REST|MQTT|GS|ECARE|E-CARE|QA|FW)$/.test(x));
  const GROUP = s => /^GS\b|Global South/i.test(s) ? 'Global South' : /^e-?Care/i.test(s) ? 'e-Care' : (s.split(/\s+/)[0] || '기타');
  // asOf
  let asOf = isDate(opt.asOf) ? opt.asOf : '';
  if (!asOf) { const ctx = dateContext(text, year); asOf = ctx.basis || ctx.latest || todayISO(); }
  // tables & sections
  const tables = []; let cur = null; const secOf = []; let h1 = '', h2 = '';
  lines.forEach((l, i) => {
    if (isHeading(l)) { if (/^\d+\.?\s/.test(l) && !/^\d+\.\d/.test(l)) { h1 = l; h2 = ''; } else h2 = l; }
    secOf[i] = h1 + ' ' + h2;
    const c = cells(l);
    if (c.length >= 3 || (cur && l.includes('\t'))) { if (!cur) { cur = { header: c, rows: [], sec: secOf[i], at: i }; tables.push(cur); } else cur.rows.push(c); }
    else cur = null;
  });
  const col = (t, re) => t.header.findIndex(h => re.test(h));
  const issues = []; const byKey = {};
  const mk = (key, o) => { const i = { key, title: '', group: '', area: '', priority: issues.length + 1, status: 'pending', owner: '', checkDate: '', summary: '', gate: '', impact: { count: null, unit: 'TC', text: '' }, constraint: null, steps: [], dependsOn: [], actions: [], events: [], requests: [], scenario: { success: '', failure: '' }, evidence: [], tokens: new Set(TOK(key)), ...o }; issues.push(i); byKey[key.toUpperCase()] = i; return i; };
  const issueT = tables.find(t => col(t, /주요 이슈/) >= 0 && col(t, /상태/) >= 0);
  const planT = tables.find(t => col(t, /우선순위/) >= 0);
  // 1) 대응 계획 표 = 이슈 골격
  if (planT) {
    const cp = col(planT, /우선순위/), cg = col(planT, /구분/), cc = col(planT, /대응|내용/), co = col(planT, /부문|담당/);
    planT.rows.forEach(r => { const key = (r[cg] || '').trim(); if (!key) return; const it = mk(key, { priority: +r[cp] || issues.length + 1, owner: r[co] || '', gate: r[cc] || '' }); it.actions.push(r[cc] || ''); });
  }
  // 2) 이슈 표로 보강 / 누락 영역 추가
  if (issueT) {
    const cg = col(issueT, /구분/), cx = col(issueT, /주요 이슈/), cs = col(issueT, /상태/), cf = col(issueT, /영향/);
    issueT.rows.forEach(r => {
      const g = r[cg] || '', x = r[cx] || '', st = r[cs] || '', f = cf >= 0 ? r[cf] || '' : '';
      const toks = TOK(g + ' ' + x), gt = TOK(g);
      let it = gt.length ? (byKey[gt[0]] || mk(gt[0], { priority: Math.min(9, issues.length + 1) })) : issues.find(i => TOK(x).includes(i.key.toUpperCase()));
      if (!it) { const k = (x.split(/\s+/)[0] || g).trim(); it = byKey[k.toUpperCase()] || mk(k, { priority: Math.min(9, issues.length + 1) }); }
      toks.forEach(t => it.tokens.add(t));
      if (!it.group) it.group = GROUP(g);
      if (!it.title) it.title = x;
      it.summary = it.summary ? it.summary + ' · ' + st : `${x} · ${st}`;
      if (!it.impact.text) it.impact.text = f;
      const n = (st + ' ' + f).match(/(\d+)건/); if (n && it.impact.count === null && /N\/T|불가/.test(st + f)) it.impact.count = +n[1];
      const s = statusOf(st + ' ' + x); if (s === 'blocked' || it.status === 'pending') it.status = s;
      if (s === 'blocked' && !it.constraint) it.constraint = { text: `${x} · ${st}`, start: '', tone: 'red' };
      it.evidence.push(r.filter(Boolean).join(' · '));
    });
  }
  // 3) 표가 없으면 제목 단위
  const lineIssue = [];
  if (!issues.length) {
    const heads = lines.map((l, i) => ({ l, i })).filter(x => isHeading(x.l) && !/현황|요약|계획|의견|결론|범위/.test(x.l));
    const bullets = lines.map((l, i) => ({ l, i })).filter(x => /^[-•]\s+/.test(x.l));
    const src2 = heads.length ? heads : bullets;
    src2.slice(0, 30).forEach(({ l, i }, n) => { const t = l.replace(/^\d+(\.\d+)*\.?\s*|^[-•]\s*/, ''); const it = mk(TOK(t)[0] || 'I' + (n + 1), { title: clip(t, 60) }); const end = src2[n + 1] ? src2[n + 1].i : lines.length; const body = lines.slice(i + 1, end); for (let k = i; k < end; k++) lineIssue[k] = it; body.forEach(b => { const dd = dateIn(b); if (dd) it.events.push({ date: dd, kind: kindOf(b), text: clip(b.replace(/^\d{1,2}(월\s*\d{1,2}일|\/\d{1,2})\s*/, ''), 90), flag: '', corrected: false, evidence: b }); }); it.evidence = body.slice(0, 10); it.summary = clip(body.find(b => /현재|불가|오류|지연|실패/.test(b)) || body[0] || t, 180); it.status = statusOf(body.join(' ')); TOK(t + ' ' + body.join(' ')).slice(0, 6).forEach(x => it.tokens.add(x)); const ow = body.join('\n').match(/(?:담당자?|관련 부문)\s*[:：]\s*([^\n]+)/); if (ow) it.owner = ow[1].trim(); body.filter(b => /조치\s*[:：]|필요|예정/.test(b)).slice(0, 4).forEach(b => it.actions.push(b.replace(/^.*?[:：]\s*/, ''))); });
    if (!issues.length) mk('I1', { title: clip(opt.title || lines[0], 60), summary: clip(lines.slice(1, 3).join(' '), 180), evidence: lines.slice(0, 8) });
  }
  issues.forEach(i => { i.tokens.add(i.key.toUpperCase()); if (!i.group) i.group = i.key === 'QA' ? 'QA' : '기타'; if (!i.title) i.title = clip(i.gate || i.key, 60); });
  // 그룹 보정: 대응 표에만 있는 키는 이슈 표의 같은 토큰 행에서 영역을 가져옴
  const best = (s, need = 1) => { const tk = TOK(s); let b = null, sc = 0; issues.forEach(i => { let v = 0; tk.forEach(t => { if (i.tokens.has(t)) v++; if (t === i.key.toUpperCase()) v += 2; }); if (v > sc) { sc = v; b = i; } }); return sc >= need ? b : null; };
  issues.forEach(i => { if (i.group === '기타' && issueT) { const r = issueT.rows.find(r => r.join(' ').toUpperCase().includes(i.key.toUpperCase())); if (r) i.group = GROUP(r[0] || ''); } i.area = i.group === i.key ? i.key : `${i.group === 'Global South' ? 'GS' : i.group} · ${i.key}`; });
  // 4) 날짜 표 → 이력
  tables.filter(t => col(t, /일자|날짜/) >= 0).forEach(t => {
    const cd = col(t, /일자|날짜/), cc = col(t, /내용/), cr = col(t, /결과|확인/);
    const it = best(t.sec + ' ' + t.rows.map(r => r.join(' ')).join(' ')); if (!it) return;
    t.rows.forEach(r => {
      const raw = r[cd] || '', m = raw.match(/(\d{1,2})\/(\d{1,2})/); const date = m ? iso(m[1], m[2]) : dateIn(raw);
      const res = r[cr] || '', content = r[cc] || '';
      const corrected = /다른 .*(구간|답변)|잘못/.test(res);
      it.events.push({ date, kind: corrected ? 'warn' : kindOf(res), text: clip(res ? `${res}` : content, 90), flag: raw.includes('*') ? '*' : '', corrected, evidence: content });
    });
  });
  // 5) 날짜로 시작하는 문장 → 이력
  lines.forEach((l, i) => {
    if (!/^\d{1,2}월\s*\d{1,2}일/.test(l) || l.length > 200) return;
    const date = dateIn(l); if (!date) return;
    const it = best(secOf[i] + ' ' + l); if (!it) return;
    let t = l.replace(/^\d{1,2}월\s*\d{1,2}일\s*(기준으로|기준)?\s*[,]?\s*/, '');
    if (t.length < 14 && lines[i + 1]) t = lines[i + 1];
    if (it.events.some(e => e.date === date && (e.kind === kindOf(l) || e.text.slice(0, 8) === t.slice(0, 8)))) return;
    it.events.push({ date, kind: kindOf(t), text: clip(t, 90), flag: '', corrected: false, evidence: l });
  });
  // 5-1) 상대 날짜로 시작하는 문장(금일 오전 …, 어제 …) → 보고 기준일 기준으로 환산한 이력
  const relStart = /^(금일|오늘|당일|어제|전일|내일|익일|명일|모레)\s*(오전|오후)?\s*[,·:]?\s*/;
  lines.forEach((l, i) => {
    const m = l.match(relStart); if (!m || l.length > 200 || l.includes('\t')) return;
    const off = { 금일: 0, 오늘: 0, 당일: 0, 어제: -1, 전일: -1, 내일: 1, 익일: 1, 명일: 1, 모레: 2 }[m[1]];
    const date = addD(asOf, off); const it = lineIssue[i] || best(secOf[i] + ' ' + l) || (issues.length === 1 ? issues[0] : null); if (!it) return;
    const t = l.replace(relStart, '') || l;
    if (it.events.some(e => e.date === date && e.text.slice(0, 8) === clip(t, 90).slice(0, 8))) return;
    it.events.push({ date, kind: off > 0 ? 'plan' : kindOf(t), text: clip(`${m[2] ? m[2] + ' ' : ''}${t}`, 90), flag: '', corrected: false, evidence: l });
  });
  // 6) 확인 필요 질의 → 요청, 우선 확인 사항 → 조치
  let inQ = false, party = '', grpT = '', curIt = null;
  lines.forEach((l, i) => {
    if (isHeading(l)) { inQ = /확인 필요|확인 사항/.test(l); party = (l.match(/(\S+)\s*측/) || [])[1] ? l.match(/(\S+)\s*측/)[1] + ' 측' : ''; grpT = ''; curIt = inQ ? best(secOf[i]) : null; return; }
    if (/^■\s*우선 확인/.test(l)) { inQ = 'prio'; return; }
    if (/^■/.test(l)) { inQ = false; return; }
    if (!inQ || l.includes('\t')) return;
    if (inQ === 'prio') { if (/^(각 항목|이에|따라)/.test(l) || l.length > 100) { inQ = false; return; } const it = best(l); if (it && !it.actions.includes(l)) it.actions.push(l); return; }
    if (/^[①②③④⑤⑥⑦⑧⑨]/.test(l)) { grpT = l.replace(/^[①-⑨]\s*/, ''); return; }
    if (l.length > 90 || /^(이에|따라|각 항목)/.test(l) || (!grpT && /^(현재|다음)/.test(l))) return;
    if (grpT && curIt) curIt.requests.push({ party: party || '상대 부문', text: l, state: 'open' });
  });
  // 7) 결과 분기 (① … 시 / ② … 시)
  lines.forEach((l, i) => {
    if (!/^①.+시$/.test(l)) return;
    const j = lines.findIndex((x, k) => k > i && /^②.+시$/.test(x)); if (j < 0) return;
    let e = j + 1; while (e < lines.length && !isHeading(lines[e]) && !/^[③④]/.test(lines[e])) e++;
    const sent = (a, b) => lines.slice(a + 1, b).join(' ').split(/(?<=[다요])\.\s*/).map(s => s.trim().replace(/^(특히|다만|반면|이에 따라|결과적으로|따라서),?\s*/, '')).filter(s => s.length > 6).slice(0, 3).join(' ');
    const it = best(secOf[i] + ' ' + l); if (!it) return;
    it.scenario = { success: sent(i, j), failure: sent(j, e) };
  });
  // 8) 영향 수치 보정
  issues.forEach(i => {
    const near = lines.filter((l, k) => TOK(l).includes(i.key.toUpperCase()));
    const own = lines.filter((l, k) => TOK(secOf[k] || '').includes(i.key.toUpperCase()) || (l.includes('\t') && TOK(l.split('\t')[0]).includes(i.key.toUpperCase())));
    const api = own.join(' ').match(/(\d+)\s*개\s*API/); if (api && i.impact.count === null) { i.impact = { count: +api[1], unit: 'API', text: `${api[1]}개 API 검증 · TC 건수와 별도` }; }
    const dep = near.join(' ').match(/([A-Z]{2,5})\s*(?:연동|연계)(?:가|이)?\s*필요/); if (dep && dep[1] !== i.key.toUpperCase() && byKey[dep[1]]) i.dependsOn.push(dep[1]);
    if (!i.evidence.length) i.evidence = near.slice(0, 4);
    if (!i.actions.length && i.gate) i.actions.push(i.gate);
  });
  // VDP 연계가 선행 조건인 영역
  lines.forEach((l, i) => { const m = l.match(/([A-Z]{2,5})\s*(?:연계|API|의존)[^.]{0,40}선행 조건/); if (m && byKey[m[1]]) { const it = l.includes('\t') ? byKey[TOK(l.split('\t')[0])[0]] : best(secOf[i], 2); if (it && it !== byKey[m[1]] && !it.dependsOn.includes(m[1])) it.dependsOn.push(m[1]); } });
  // 9) QA 분류 / 사유
  const metrics = [];
  const mT = tables.find(t => col(t, /전체\s*TC/) >= 0);
  if (mT) {
    const ct = col(mT, /전체/), cn = col(mT, /불가|N\/T/), cl = col(mT, /제한/), co = col(mT, /기타/), num = v => +(String(v || '').replace(/[^\d]/g, '')) || 0;
    mT.rows.filter(r => !/합계/.test(r[0])).forEach(r => metrics.push({ label: r[0], total: num(r[ct]), blocked: num(r[cn]), limited: cl >= 0 ? num(r[cl]) : 0, other: co >= 0 ? num(r[co]) : 0 }));
  }
  let reasons = null;
  const rT = tables.find(t => col(t, /사유/) >= 0 && col(t, /건수/) >= 0);
  if (rT) {
    const cl = col(rT, /사유/), cc = col(rT, /건수/), ca = col(rT, /조치/);
    const rep = rT.rows.find(r => /집계/.test(r[cl]));
    reasons = { title: (rT.sec.replace(/\d+(\.\d+)*\.?\s*/g, '').trim().split(/\s{1,}/).slice(-2).join(' ') || 'N/T') + ' N/T 사유', rows: rT.rows.filter(r => !/합계|집계/.test(r[cl])).map(r => { const k = best(r[cl] + ' ' + (r[ca] || '')); return { label: r[cl], count: +r[cc] || 0, action: r[ca] || '', key: k ? k.key : '' }; }), reported: rep ? +rep[cc] || 0 : 0, note: rep ? rep[ca] || '' : '' };
    if (reasons.title.length > 30) reasons.title = 'N/T 사유';
    reasons.rows.forEach(r => { const it = byKey[(r.key || '').toUpperCase()]; if (it && /ADF/.test(r.label) && it.impact.count === null) it.impact = { count: r.count, unit: 'TC', text: `${r.label} ${r.count}건` }; });
  }
  // 10) 품질 메모 · 종합 의견
  const notes = [];
  if (reasons && reasons.reported) { const s = reasons.rows.reduce((a, r) => a + r.count, 0); if (s !== reasons.reported) notes.push(`${reasons.title} 집계 ${reasons.reported}건 ↔ 사유별 합계 ${s}건 · 차이 ${Math.abs(reasons.reported - s)}건 확인 필요`); }
  lines.filter(l => /^※/.test(l) && /최종 확인|확인이 필요/.test(l) && /일/.test(l)).forEach(l => notes.push(l.replace(/^※\s*/, '')));
  const points = [];
  lines.forEach((l, i) => { const m = l.match(/^(첫째|둘째|셋째|넷째),?\s*(.+)/); if (m) points.push({ title: m[2].replace(/입니다\.?$/, ''), body: lines.slice(i + 1, i + 3).filter(x => !/^(첫째|둘째|셋째|넷째|결론)/.test(x)).join(' ').slice(0, 260) }); });
  const concl = lines.find(l => /^결론적으로/.test(l));
  let title = opt.title || lines[0]; const mt = title.match(/^(.+?)(?:와|과)?\s*관련하여/); if (!opt.title && mt) title = mt[1].trim() + ' 이슈 점검';
  issues.forEach(i => { delete i.tokens; i.title = clip(i.title, 60); i.summary = clip(i.summary, 240); i.actions = [...new Set(i.actions.filter(Boolean))].slice(0, 8); i.events.sort((a, b) => (a.date || '9') < (b.date || '9') ? -1 : 1); if (!i.scenario.success) i.scenario.success = i.gate ? `${clip(i.gate, 80)} 충족 후 관련 검증 범위를 다시 확정합니다.` : ''; if (!i.scenario.failure) i.scenario.failure = '선행 조건이 남으면 현재 제약을 유지하고 다음 점검을 진행합니다.'; const firstFail = i.events.find(e => e.date && e.kind === 'fail'); if (i.constraint && !i.constraint.start && firstFail && i.events.filter(e => e.date).length > 2) i.constraint.start = i.events.find(e => e.date).date; });
  return { title: clip(title, 80), asOf, issues, metrics, reasons, notes, conclusion: { points, summary: concl ? concl.replace(/^결론적으로,?\s*/, '') : '' }, source: text };
}

/* ================= Claude 정리 ================= */
const CLAUDE_SHAPE = `{
 "title":"짧은 문서 제목","subtitle":"한 줄 부제","asOf":"YYYY-MM-DD(텍스트의 금일/현재/기준 날짜)",
 "issues":[{
  "key":"짧은 약어(DCM, VDP …)","title":"이슈 이름 12~24자","group":"상위 영역(예: Global South, e-Care, DMS, QA)","area":"표시용 '영역 · 주제'",
  "priority":1,"status":"blocked|progress|pending|resolved","owner":"원문에 있는 담당/관련 부문, 없으면 빈 문자열","checkDate":"원문에 있는 점검일 YYYY-MM-DD 또는 빈 문자열",
  "summary":"현재 현황 1~2문장","gate":"완료 조건·검증 게이트(화살표로 단계)",
  "impact":{"count":숫자 또는 null,"unit":"TC|API","text":"영향 범위 한 줄"},
  "constraint":{"text":"지금 막고 있는 상태 한 줄","start":"시작일 YYYY-MM-DD 또는 빈 문자열","tone":"red|amber"} 또는 null,
  "steps":[["단계명","done|current|todo|fail"]],
  "dependsOn":["선행 이슈 key"],
  "actions":["다음 조치"],
  "events":[{"date":"YYYY-MM-DD 또는 빈 문자열","kind":"fact|fail|ok|warn|plan","text":"결과가 드러나는 한 줄","flag":"''|'*'(날짜 재확인)|'~'(추정)","corrected":false,"evidence":"원문 문장"}],
  "requests":[{"party":"답해야 할 상대","text":"질의 한 문장"}],
  "scenario":{"success":"선행 조건 해소 시","failure":"해소되지 않을 때"},
  "evidence":["원문 근거 문장"]
 }],
 "metrics":[{"label":"영역","total":0,"blocked":0,"limited":0,"other":0}],
 "reasons":{"title":"어느 영역 N/T 사유","rows":[{"label":"","count":0,"action":"","key":"관련 이슈 key"}],"reported":0,"note":""},
 "notes":["집계 불일치·날짜 재확인 등 품질 메모"],
 "conclusion":{"points":[{"title":"","body":"2문장 이내"}],"summary":"한 문장 결론"}
}`;
function claudePrompt(src, opt) {
  return `너는 MapStone '이슈관리 모드'의 정리기다. 아래 이슈 보고 텍스트를 담당자가 이슈 단위로 추적·관리하고, 이해관계자가 타임라인으로 빠르게 이해할 수 있도록 JSON 하나로 구조화하라.

규칙
- 출력은 JSON 객체 하나. 설명·코드펜스 금지. 문자열은 한국어(고유명사·약어는 원문 유지).
- 원문에 없는 날짜·담당·숫자를 지어내지 마라. 모르면 빈 문자열/null. 연도가 없으면 ${(opt.asOf || todayISO()).slice(0, 4)}년.
- '금일·오늘·당일·오전·오후·어제·전일·내일·익일' 같은 상대 날짜 표현은 보고 기준일 ${opt.asOf || '(원문 기준일)'}을 기준으로 환산하라. 입력한 날과 같다고 가정하지 마라.
- 이슈는 담당자가 따로 추적해야 하는 단위(시스템·환경 단위)로 5~10개. 대응 계획/우선순위 표가 있으면 그 순서를 우선순위로.
- 일자별 경과 표의 각 행은 해당 이슈의 events 하나. 나중에 틀린 것으로 밝혀진 안내는 corrected:true, kind:"warn".
- 결과에 따라 범위가 갈리는 판단('정상 수행 시/실패 시')은 해당 이슈의 scenario와 steps로.
- 상대 부문에 확인해야 하는 질문은 requests(질문 하나당 하나).
- 다른 이슈가 해결돼야 진행 가능한 이슈는 dependsOn에 선행 이슈 key.
- TC 수행 가능 분류표는 metrics(합계 행 제외), 사유별 표는 reasons, 종합 의견은 conclusion.
- QA 수행 가능 분류는 Pass/Fail 결과가 아니다. API 개수와 TC 건수를 섞지 마라.
- 집계 불일치, 추정 원인, 날짜 재확인 필요 사항은 notes·flag·events에 남겨라.
${opt.title ? `- 문서 제목은 "${opt.title}"로 하라.\n` : ''}${opt.asOf ? `- 기준일은 ${opt.asOf}.\n` : ''}
JSON 형태
${CLAUDE_SHAPE}

이슈 텍스트
"""
${src}
"""`;
}
