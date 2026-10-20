// 타임라인 스크롤 성능·떨림 검증 (저장소 루트를 4191 포트로 띄운 뒤 실행: node issue-mode/qa-scroll.cjs)
// 실제 마우스 휠(trusted) 입력으로 스크롤하면서 매 프레임(rAF) 다음을 기록한다.
//  - 고정 요소 오차(px): 머리 3열 top ↔ 스크롤 영역 top, 왼쪽 열 left ↔ 영역 left, 오른쪽 열 right ↔ 영역 right,
//    아래 NOW 줄 bottom ↔ 영역 bottom, 위 NOW 알약 중심 ↔ NOW 선 중심(가로 스크롤 중 어긋남)
//  - 프레임 간격 p95 / 50ms 초과 횟수
// 기준: 고정 요소 오차 최대 0.5px 이하, p95 33.4ms 이하, 50ms 초과 0회 (AGENTS.md 슬라이더 기준과 동일)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const URL = process.env.IM_URL || 'http://127.0.0.1:4191/issues.html';
const WIDTHS = (process.env.IM_WIDTHS || '1600,1024,390').split(',').map(Number);

const sampler = () => {
  window.__qs = { frames: [], err: [], on: false };
  const sc = () => document.querySelector('#canvas .tl-scroll, #r-canvas .tl-scroll');
  const tick = t => {
    const q = window.__qs;
    if (q.on) {
      q.frames.push(t);
      const s = sc();
      if (s) {
        const r = s.getBoundingClientRect(), cw = s.clientWidth, ch = s.clientHeight;
        const heads = [...s.querySelectorAll('.tl-head')].filter(h => h.offsetParent);
        const L = s.querySelector('.tl-l'), R = s.querySelector('.tl-r'), foot = s.querySelector('.tl-mid .tl-foot');
        const pill = s.querySelector('.tl-now.top'), line = s.querySelector('.tl-nowline');
        const e = [];
        heads.forEach(h => e.push(Math.abs(h.getBoundingClientRect().top - r.top)));
        if (L) e.push(Math.abs(L.getBoundingClientRect().left - r.left));
        if (R && R.offsetParent) e.push(Math.abs(R.getBoundingClientRect().right - (r.left + cw)));
        if (foot) e.push(Math.abs(Math.min(foot.getBoundingClientRect().bottom, r.top + ch) - (r.top + ch)));
        if (pill && line) { const a = pill.getBoundingClientRect(), b = line.getBoundingClientRect(); e.push(Math.abs((a.left + a.width / 2) - (b.left + b.width / 2))); }
        q.err.push(Math.max(0, ...e));
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const stats = q => {
  const d = q.frames.slice(1).map((t, i) => t - q.frames[i]).sort((a, b) => a - b);
  const p95 = d.length ? d[Math.min(d.length - 1, Math.floor(d.length * 0.95))] : 0;
  return { frames: q.frames.length, p95: Math.round(p95 * 10) / 10, over50: d.filter(x => x > 50).length, maxErr: Math.round(Math.max(0, ...q.err) * 100) / 100 };
};

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  let fail = 0; const rows = [];
  for (const W of WIDTHS) {
    const p = await b.newPage({ viewport: { width: W, height: W < 500 ? 844 : 900 } });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.addInitScript(sampler);
    await p.goto(URL); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    const run = async (name, prep, gesture) => {
      await prep();
      const pos = () => p.evaluate(() => { const s = document.querySelector('#canvas .tl-scroll'); return [s.scrollTop, s.scrollLeft, window.scrollY]; });
      const room = await p.evaluate(h => { const s = document.querySelector('#canvas .tl-scroll'); return h ? s.scrollWidth - s.clientWidth : Math.max(s.scrollHeight - s.clientHeight, document.documentElement.scrollHeight - innerHeight); }, name.startsWith('가로'));
      const before = await pos();
      await p.evaluate(() => { window.__qs.frames = []; window.__qs.err = []; window.__qs.on = true; });
      await gesture();
      await p.waitForTimeout(250);
      const r = stats(await p.evaluate(() => { window.__qs.on = false; return window.__qs; }));
      const after = await pos(), moved = Math.round(Math.max(...after.map((v, i) => Math.abs(v - before[i]))));
      const ok = moved >= Math.min(80, room) && r.maxErr <= 0.5 && r.p95 <= 33.4 && r.over50 === 0;
      if (!ok) fail++;
      rows.push(`${ok ? 'PASS' : 'FAIL'} [${W}] ${name}: 이동 ${moved}px frames=${r.frames} p95=${r.p95}ms over50=${r.over50} 고정오차max=${r.maxErr}px`);
    };
    const box = async () => (await p.$('#canvas .tl-scroll')).boundingBox();
    // 1) 타임라인 안에서 세로 스크롤 (3회 × 휠 24번)
    for (let k = 0; k < 3; k++) await run(`세로 스크롤 ${k + 1}`, async () => {
      await p.evaluate(k => { const s = document.querySelector('#canvas .tl-scroll'); s.scrollIntoView({ block: 'start' }); window.scrollBy(0, -90); s.scrollTop = k === 2 ? s.scrollHeight : 0; }, k);
      await p.waitForTimeout(150); const bb = await box(); await p.mouse.move(bb.x + bb.width / 2, bb.y + Math.min(bb.height - 40, 260));
    }, async () => { for (let i = 0; i < 24; i++) { await p.mouse.wheel(0, k === 2 ? -60 : 60); await p.waitForTimeout(16); } });
    // 2) 가로 스크롤 (deltaX) — 빈 기간 접기를 꺼서 날짜 축을 화면보다 넓게 만든 뒤 측정
    if (await p.evaluate(() => { const s = document.querySelector('#canvas .tl-scroll'); return s.scrollWidth <= s.clientWidth; })) { await p.click('#t-comp'); await p.waitForTimeout(300); }
    rows.push(`INFO [${W}] 가로 스크롤 폭 ${await p.evaluate(() => { const s = document.querySelector('#canvas .tl-scroll'); return s.scrollWidth + '/' + s.clientWidth; })}`);
    for (let k = 0; k < 3; k++) await run(`가로 스크롤 ${k + 1}`, async () => {
      const bb = await box(); await p.mouse.move(bb.x + bb.width / 2, bb.y + Math.min(bb.height - 40, 200));
      if (k === 0) await p.evaluate(() => { document.querySelector('#canvas .tl-scroll').scrollLeft = 0; });
    }, async () => { for (let i = 0; i < 24; i++) { await p.mouse.wheel(k === 1 ? -40 : 40, 0); await p.waitForTimeout(16); } });
    // 3) 페이지 스크롤(타임라인 바깥에서 휠) — 머리가 카드 안에서 흔들리지 않아야 함
    await run('페이지 스크롤', async () => { await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(100); await p.mouse.move(8, (W < 500 ? 844 : 900) - 8); },
      async () => { for (let i = 0; i < 24; i++) { await p.mouse.wheel(0, 70); await p.waitForTimeout(16); } });
    if (errs.length) { fail++; rows.push(`FAIL [${W}] 페이지 오류: ${errs.join(' | ')}`); }
    await p.close();
  }
  console.log(rows.join('\n')); console.log(`\n${rows.filter(x => x.startsWith('PASS')).length} passed, ${fail} failed`);
  await b.close();
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('CRASH', e.message); process.exit(1); });
