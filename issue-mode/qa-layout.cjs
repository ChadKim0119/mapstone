// 레이아웃 정렬·잘림·겹침 자동 검수
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright');
const URL = process.env.IM_URL || 'http://127.0.0.1:4191/issues.html';
const WIDTHS = (process.argv[2] || '1920,1600,1440,1280,1024,390').split(',').map(Number);
const SHOT = process.argv[3] === 'shot';
const audit = () => {
  const issues = [];
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const name = e => (e.id ? '#' + e.id : '') + '.' + [...e.classList].join('.') + ' "' + (e.textContent || e.value || e.placeholder || '').trim().replace(/\s+/g, ' ').slice(0, 28) + '"';
  // 1 page overflow
  if (document.documentElement.scrollWidth > innerWidth + 1) issues.push(`가로 스크롤: scrollWidth ${document.documentElement.scrollWidth} > ${innerWidth}`);
  // 2 row alignment of controls
  const ctl = '.btn,.seg,.toggle,.input,.select,.search,.stbtn';
  document.querySelectorAll('.appbar-in,.ws-bar-l,.ws-bar-r,.dochead-r,.tools,.dlg-f,.dlg-f>span,.rtabs,.rtabs-l,.addrow,.blk-h,.party-h,.sec-h,.insp-foot,.scn-top,.rv-h,.foot-r,.dlg-h,.rv-sum').forEach(box => {
    if (!vis(box)) return;
    const kids = [...box.children].filter(k => vis(k) && (k.matches(ctl) || k.querySelector(':scope > .input')));
    const rows = [];
    kids.forEach(k => { const r = k.getBoundingClientRect(); let row = rows.find(x => Math.abs(x.top - r.top) < r.height * 0.6); if (!row) rows.push(row = { top: r.top, items: [] }); row.items.push({ k, r }); });
    rows.forEach(row => {
      if (row.items.length < 2) return;
      const cs = row.items.map(x => x.r.top + x.r.height / 2), hs = row.items.map(x => Math.round(x.r.height));
      if (Math.max(...cs) - Math.min(...cs) > 1.01) issues.push(`세로 정렬 어긋남 in ${name(box).slice(0, 40)}: centers ${cs.map(c => c.toFixed(1)).join('/')} (${row.items.map(x => name(x.k).slice(0, 24)).join(' | ')})`);
      const big = row.items.filter(x => !x.k.matches('.sm,.stbtn') && !x.k.querySelector('.sm')).map(x => Math.round(x.r.height));
      if (big.length > 1 && Math.max(...big) - Math.min(...big) > 1) issues.push(`높이 불일치 in ${name(box).slice(0, 40)}: ${hs.join('/')} (${row.items.map(x => name(x.k).slice(0, 20)).join(' | ')})`);
    });
  });
  // 3 clipping (non-ellipsis) & control label truncation
  document.querySelectorAll('button,.btn,.badge,.chip,.kpi .val,.kpi .lab,th,.tl-day,.tl-today,.step,.stbtn,h1,h2,h3,label,.seg button,.toggle,.verdict .big,.gate-lab').forEach(e => {
    if (!vis(e) || e.matches('.sr') || e.closest('.tl-mid .tl-row')) return;
    const cs = getComputedStyle(e);
    const clipped = e.scrollWidth > e.clientWidth + 1 && cs.overflow !== 'visible';
    if (clipped && cs.textOverflow !== 'ellipsis' && !e.querySelector('[style*="ellipsis"]')) issues.push(`잘림: ${name(e)} (${e.scrollWidth}>${e.clientWidth})`);
    if (e.matches('button,.btn,.seg button,.toggle,.stbtn') && !e.matches('.chip,.step,.tl-row,.qi,.gate-row,.link,.sort,.x,.rm,.ev') && e.scrollHeight > e.clientHeight + 2) issues.push(`버튼 줄바꿈: ${name(e)} h=${e.clientHeight} sh=${e.scrollHeight}`);
  });
  document.querySelectorAll('.btn span,.chip span,.step span,.badge').forEach(e => { if (vis(e) && e.scrollWidth > e.clientWidth + 1 && !e.closest('.tl-r,.steps,.rv-h,td')) issues.push(`말줄임 라벨: ${name(e)}`); });
  // 4 content escaping its card
  document.querySelectorAll('.card,.dlg').forEach(card => {
    if (!vis(card)) return; const R = card.getBoundingClientRect();
    card.querySelectorAll('*').forEach(e => {
      if (!vis(e) || e.closest('.tw,.tl,.tl-clip,.dep-svg,.insp-body,.dlg-b,.deps') || e.matches('svg *,option,datalist')) return;
      const r = e.getBoundingClientRect();
      if (r.left < R.left - 1 || r.right > R.right + 1) issues.push(`카드 밖으로 나감: ${name(e)} in ${name(card).slice(0, 30)} (${Math.round(r.left)}-${Math.round(r.right)} vs ${Math.round(R.left)}-${Math.round(R.right)})`);
    });
  });
  // 5 timeline item overlap & row overflow
  document.querySelectorAll('.tl-mid .tl-row').forEach(row => {
    const its = [...row.querySelectorAll('.issue-card,.ev,.band,.flag')].map(e => ({ e, r: e.getBoundingClientRect() }));
    const RR = row.getBoundingClientRect();
    its.forEach((a, i) => {
      if (a.r.bottom > RR.bottom + 1) issues.push(`타임라인 행 밖으로 나감: ${name(a.e)}`);
      its.slice(i + 1).forEach(b => { if (a.r.left < b.r.right - 1 && b.r.left < a.r.right - 1 && a.r.top < b.r.bottom - 1 && b.r.top < a.r.bottom - 1) issues.push(`타임라인 겹침: ${name(a.e)} ↔ ${name(b.e)}`); });
    });
  });
  // 6 row height sync
  const ids = new Set([...document.querySelectorAll('.tl-l .tl-row')].map(e => e.dataset.row));
  ids.forEach(id => { const hs = [...document.querySelectorAll(`.tl-row[data-row="${id}"]`)].filter(e => !e.matches('.chip,button.chip') && vis(e)).map(e => Math.round(e.getBoundingClientRect().height)); if (new Set(hs).size > 1) issues.push(`행 높이 불일치 ${id}: ${hs.join('/')}`); });
  const tops = [...document.querySelectorAll('.tl')].map(tl => [...tl.children].map(c => [...c.querySelectorAll(':scope .tl-head, :scope .tl-grp, :scope > .tl-row, :scope .tl-midin > .tl-row')].map(e => Math.round(e.getBoundingClientRect().top))));
  tops.forEach(t => { if (t.length === 3 && t[2].some(v => v !== t[2][0] || true) && [...document.querySelectorAll('.tl-r')].every(vis)) { const [a, b, c] = t; if (a.length !== c.length || a.some((v, k) => Math.abs(v - c[k]) > 1)) issues.push('좌·우 열 행 위치 어긋남'); } });
  return [...new Set(issues)];
};
(async () => {
  const b = await chromium.launch({ executablePath: process.env.IM_CHROMIUM || '/opt/pw-browsers/chromium' });
  let total = 0;
  for (const W of WIDTHS) {
    const p = await b.newPage({ viewport: { width: W, height: W < 500 ? 844 : 1000 } });
    await p.goto(URL); await p.evaluate(() => { localStorage.clear(); }); await p.reload(); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    const states = [
      ['관리', async () => { }],
      ['관리-요청탭', async () => { await p.click('.tl-l .tl-row'); await p.click('[data-itab="requests"]'); }],
      ['관리-이력탭', async () => { await p.click('[data-itab="history"]'); }],
      ['관리-표', async () => { if (W<=1100) await p.click('#i-close'); await p.click('#lv-l'); }],
      ['입력1', async () => { await p.click('#lv-t'); await p.click('#b-import'); await p.click('#im-ex'); }],
      ['입력-기준일질문', async () => { if (await p.$('#im-rule')) await p.click('#im-rule'); await p.click('#im-run'); await p.waitForTimeout(200); }],
      ['입력2', async () => { await p.click('#im-ask-ok'); await p.waitForTimeout(200); }],
      ['QA편집', async () => { await p.keyboard.press('Escape'); await p.click('#b-qa'); }],
      ['보고-요약', async () => { await p.keyboard.press('Escape'); await p.click('#v-r'); }],
      ['보고-시나리오', async () => { await p.click('#rt-scenario'); }],
      ['보고-회신', async () => { await p.click('#rt-requests'); }]];
    for (const [nm, act] of states) {
      await act(); await p.waitForTimeout(200);
      const r = await p.evaluate(audit);
      total += r.length;
      console.log(`[${W}] ${nm}: ${r.length ? r.length + '건' : 'OK'}`); r.slice(0, 14).forEach(x => console.log('   - ' + x));
      if (SHOT) await p.screenshot({ path: `L-${W}-${nm}.png`, fullPage: !nm.startsWith('입력') && nm !== 'QA편집' });
    }
    await p.close();
  }
  console.log('TOTAL', total);
  await b.close();
  process.exitCode = total ? 1 : 0;
})();
