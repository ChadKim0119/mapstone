// 타임라인 스크롤 성능·떨림 검증 (저장소 루트를 4191 포트로 띄운 뒤 실행: node issue-mode/qa-scroll.cjs)
// 구조: 세로 스크롤은 페이지 하나, 머리 줄은 화면 맨 위(sticky top:0)·아래 NOW 줄은 화면 맨 아래(sticky bottom:0),
//       가로 스크롤은 본문 가운데 열(.tl-mid)만, 머리·아래 줄의 날짜 축은 스크롤 연동 애니메이션으로 따라감.
// 실제 마우스 휠(trusted) 입력으로 스크롤하면서 매 프레임(rAF) 다음을 기록한다.
//  - 고정 오차(px): 머리 줄 top ↔ 기대 위치(min(max(0, 본문 top − 머리 높이), 카드 안쪽 bottom − 머리 높이)),
//    아래 줄 top ↔ 기대 위치(max(min(화면 높이 − 줄 높이, 본문 bottom), 카드 안쪽 top)),
//    머리·아래 줄 날짜 축 left ↔ 본문 날짜 축 left, 위·아래 NOW 알약 중심 ↔ 본문 NOW 선 중심
//  - 프레임 간격 p95 / 50ms 초과 횟수
// 기준: 고정 오차 최대 0.5px 이하, p95 33.4ms 이하, 50ms 초과 0회 (AGENTS.md 기준)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const URL = process.env.IM_URL || 'http://127.0.0.1:4191/issues.html';
const WIDTHS = (process.env.IM_WIDTHS || '1600,1024,390').split(',').map(Number);

const sampler = () => {
  window.__qs = { frames: [], err: [], on: false };
  const tick = t => {
    const q = window.__qs;
    if (q.on) {
      q.frames.push(t);
      const host = document.querySelector('#canvas') || document.querySelector('#r-canvas');
      const H = host && host.querySelector('.tl-hrow'), F = host && host.querySelector('.tl-frow'), T = host && host.querySelector('.tl');
      if (H && F && T) {
        const c = host.getBoundingClientRect(), cs = getComputedStyle(host), inTop = c.top + parseFloat(cs.borderTopWidth), inBot = c.bottom - parseFloat(cs.borderBottomWidth);
        const h = H.getBoundingClientRect(), f = F.getBoundingClientRect(), t = T.getBoundingClientRect();
        const e = [Math.abs(h.height - 44), Math.abs(f.height - 36)]; // 머리 줄 44px·아래 줄 36px 한 줄 유지
        e.push(Math.abs(h.top - Math.min(Math.max(0, t.top - h.height), inBot - h.height)));
        e.push(Math.abs(f.top - Math.max(Math.min(innerHeight - f.height, t.bottom), inTop)));
        const mi = host.querySelector('.tl-midin').getBoundingClientRect().left;
        e.push(Math.abs(host.querySelector('.tl-hin').getBoundingClientRect().left - mi), Math.abs(host.querySelector('.tl-fin').getBoundingClientRect().left - mi));
        const line = host.querySelector('.tl-nowline');
        if (line) { const lc = line.getBoundingClientRect(); const cx = lc.left + lc.width / 2; host.querySelectorAll('.tl-now').forEach(n => { const r = n.getBoundingClientRect(); e.push(Math.abs(r.left + r.width / 2 - cx)); }); }
        q.err.push(Math.max(...e));
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const stats = q => {
  const d = q.frames.slice(1).map((t, i) => t - q.frames[i]).sort((a, b) => a - b);
  const p95 = d.length ? d[Math.min(d.length - 1, Math.floor(d.length * 0.95))] : 0;
  const d0 = q.frames.slice(1).map((t, i) => t - q.frames[i]); const slow = d0.map((x, i) => x > 50 ? `#${i + 1}/${d0.length}:${Math.round(x)}ms` : '').filter(Boolean).join(' ');
  return { slow, frames: q.frames.length, err: q.err.length, p95: Math.round(p95 * 10) / 10, over50: d.filter(x => x > 50).length, maxErr: Math.round(Math.max(0, ...q.err) * 100) / 100 };
};

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  let fail = 0; const rows = [];
  for (const W of WIDTHS) {
    const p = await b.newPage({ viewport: { width: W, height: W < 500 ? 844 : 900 } });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.addInitScript(sampler);
    // IM_FALLBACK=1: 스크롤 연동 애니메이션 미지원 브라우저 경로(가로 동기화 JS 보조)를 강제로 측정
    if (process.env.IM_FALLBACK) await p.addInitScript(() => { const o = CSS.supports.bind(CSS); CSS.supports = (...a) => /animation-timeline/.test(a.join(' ')) ? false : o(...a); document.addEventListener('DOMContentLoaded', () => { const st = document.createElement('style'); st.textContent = '.tl-hin,.tl-fin{animation:none!important}'; document.head.appendChild(st); }); });
    await p.goto(URL); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    const vh = W < 500 ? 844 : 900;
    const run = async (name, prep, gesture) => {
      await prep();
      const pos = () => p.evaluate(() => [document.querySelector('#canvas .tl-mid').scrollLeft, window.scrollY]);
      const room = await p.evaluate(([h, up]) => { const m = document.querySelector('#canvas .tl-mid'); return h ? m.scrollWidth - m.clientWidth : up ? window.scrollY : document.documentElement.scrollHeight - innerHeight - window.scrollY; }, [name.startsWith('가로'), name.endsWith('3') && name.startsWith('세로')]);
      const before = await pos();
      await p.evaluate(() => { window.__qs.frames = []; window.__qs.err = []; window.__qs.on = true; });
      await gesture();
      await p.waitForTimeout(250);
      const r = stats(await p.evaluate(() => { window.__qs.on = false; return window.__qs; }));
      const after = await pos(), moved = Math.round(Math.max(...after.map((v, i) => Math.abs(v - before[i]))));
      const ok = moved >= Math.min(80, room) && r.err > 0 && r.maxErr <= 0.5 && r.p95 <= 33.4 && r.over50 === 0;
      if (!ok) fail++;
      rows.push(`${ok ? 'PASS' : 'FAIL'} [${W}] ${name}: 이동 ${moved}px frames=${r.frames} 측정=${r.err} p95=${r.p95}ms over50=${r.over50} 고정오차max=${r.maxErr}px${r.slow ? ' 느린프레임 ' + r.slow : ''}`);
    };
    // 타임라인 본문 가운데 열 위의 화면 좌표(화면 안에 보이는 지점)
    const overMid = async () => { const pt = await p.evaluate(vh => { const bb = document.querySelector('#canvas .tl-mid').getBoundingClientRect(); const x = bb.x + bb.width / 2; for (let y = Math.round(vh * 0.3); y < vh * 0.85; y += 20) { const e = document.elementFromPoint(x, y); if (e && e.closest('.tl-mid') && !e.closest('.ev,.band,.flag')) return { x, y, ok: true }; } return { x, y: Math.round(vh / 2), ok: false }; }, vh); if (!pt.ok) rows.push(`INFO [${W}] 휠 위치가 본문 가운데 열 밖`); return pt; };
    const tlTop = () => p.evaluate(() => document.querySelector('#canvas .tl').getBoundingClientRect().top + window.scrollY - document.querySelector('#canvas .tl-hrow').offsetHeight); // 머리 줄은 sticky라 본문 기준으로 원래 위치 계산
    // 1) 타임라인 위에서 세로 휠 → 페이지 스크롤 (머리가 화면 맨 위에 붙고, 아래 NOW 줄은 화면 맨 아래에 붙음) 3회
    for (let k = 0; k < 3; k++) await run(`세로 스크롤 ${k + 1}`, async () => {
      const top = await tlTop();
      await p.evaluate(([k, top]) => window.scrollTo(0, k === 0 ? Math.max(0, top - 300) : k === 1 ? top : document.documentElement.scrollHeight), [k, top]);
      await p.waitForTimeout(150); const m = await overMid(); await p.mouse.move(m.x, m.y);
    }, async () => { for (let i = 0; i < 24; i++) { await p.mouse.wheel(0, k === 2 ? -70 : 70); await p.waitForTimeout(16); } });
    // 2) 가로 스크롤 (deltaX, 머리가 붙은 상태) — 빈 기간 접기를 꺼서 날짜 축을 화면보다 넓게 만든 뒤 측정
    if (await p.evaluate(() => { const m = document.querySelector('#canvas .tl-mid'); return m.scrollWidth <= m.clientWidth; })) { await p.click('#t-comp'); await p.waitForTimeout(300); }
    rows.push(`INFO [${W}] 가로 스크롤 폭 ${await p.evaluate(() => { const m = document.querySelector('#canvas .tl-mid'); return m.scrollWidth + '/' + m.clientWidth; })} · scroll-timeline ${await p.evaluate(() => CSS.supports('animation-timeline: --a'))}`);
    for (let k = 0; k < 3; k++) await run(`가로 스크롤 ${k + 1}`, async () => {
      const top = await tlTop(); await p.evaluate(top => window.scrollTo(0, top + 200), top); await p.waitForTimeout(120);
      if (k === 0) await p.evaluate(() => { document.querySelector('#canvas .tl-mid').scrollLeft = 0; });
      const m = await overMid(); await p.mouse.move(m.x, m.y);
    }, async () => { for (let i = 0; i < 24; i++) { await p.mouse.wheel(k === 1 ? -40 : 40, 0); await p.waitForTimeout(16); } });
    // 3) 페이지 맨 위부터 타임라인 바깥(왼쪽 여백)에서 휠 — 머리가 화면 맨 위로 들어와 붙는 순간 포함
    await run('페이지 스크롤', async () => { await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(100); await p.mouse.move(4, vh - 8); },
      async () => { for (let i = 0; i < 30; i++) { await p.mouse.wheel(0, 70); await p.waitForTimeout(16); } });
    if (errs.length) { fail++; rows.push(`FAIL [${W}] 페이지 오류: ${errs.join(' | ')}`); }
    await p.close();
  }
  console.log(rows.join('\n')); console.log(`\n${rows.filter(x => x.startsWith('PASS')).length} passed, ${fail} failed`);
  await b.close();
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('CRASH', e.message); process.exit(1); });
