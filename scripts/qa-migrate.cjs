// 주소 통일 E2E (node scripts/qa-migrate.cjs): 예전 주소(hazel) → mapstone-app. 두 주소와 Supabase API를 가짜로 띄워 백업 파일·합치기·키 이전·클라우드 저장·재방문 이동을 확인
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..'), OUT = process.env.QA_OUT || require('os').tmpdir();
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const keyA = 'a'.repeat(48), keyB = 'b'.repeat(48);
const P = '11111111-1111-4111-8111-111111111111', Q = '22222222-2222-4222-8222-222222222222';
function scenario(appHasData) {
  const db = { projects: { [P]: { owner: sha(keyA), title: 'GS 개발 일정 (09/03 Version)', versions: 5 } } };
  if (appHasData) db.projects[Q] = { owner: sha(keyB), title: 'App 쪽 일정', versions: 2 };
  return db;
}
const docA = { schemaVersion: 1, title: 'GS 개발 일정 (09/03 Version)', cfg: { startY: 2026, startM: 9, months: 3 }, rows: [{ id: 'r1', name: 'A' }], items: [{ id: 'a', kind: 'chev', row: 'r1', s: 0.2, e: 1, label: 'hazel 작업', color: '#3568c5' }], notes: [], now: 1.6, versionProjectId: P, versions: [1, 2, 3, 4, 5].map(n => ({ id: 'o' + n, projectId: P, sequence: n, note: '', title: 'GS', date: '2026-10-19', snap: '' })) };
const docB = { ...docA, title: 'App 쪽 일정', items: [{ id: 'b', kind: 'chev', row: 'r1', s: 0.1, e: 0.5, label: 'app 작업', color: '#3568c5' }], versionProjectId: Q, versions: [] };
const issueA = { schema: 2, title: '2차 DVT 이슈', issues: [{ id: 'x', title: 'VDP' }], example: false };
async function run(appHasData) {
  const db = scenario(appHasData), calls = [];
  const b = await chromium.launch({ ...(process.env.PLAYWRIGHT_MODULE ? {} : { executablePath: '/opt/pw-browsers/chromium' }) });
  const ctx = await b.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 } });
  const serve = async rt => {
    const u = new URL(rt.request().url()); let f = decodeURIComponent(u.pathname); if (f.endsWith('/')) f += 'index.html';
    const fp = path.join(ROOT, f); if (!fp.startsWith(ROOT) || !fs.existsSync(fp)) return rt.fulfill({ status: 404, body: 'nf' });
    const type = fp.endsWith('.html') ? 'text/html' : fp.endsWith('.svg') ? 'image/svg+xml' : fp.endsWith('.woff2') ? 'font/woff2' : fp.endsWith('.js') ? 'text/javascript' : 'application/octet-stream';
    rt.fulfill({ status: 200, contentType: type, body: fs.readFileSync(fp) });
  };
  await ctx.route('https://mapstone-hazel.vercel.app/**', serve);
  await ctx.route('https://mapstone-app.vercel.app/**', serve);
  await ctx.route('https://mffysunppwqscbljooda.supabase.co/**', async rt => {
    const r = rt.request(), u = new URL(r.url()), m = r.method(), p = u.pathname.split('mapstone-api')[1], code = r.headers()['x-mapstone-code'] || '';
    const j = (body, s = 200) => rt.fulfill({ status: s, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(body) });
    if (m === 'OPTIONS') return rt.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' } });
    calls.push(m + ' ' + p); const owner = sha(code);
    if (m === 'GET' && p === '/version-projects') return j(Object.entries(db.projects).filter(([, v]) => v.owner === owner).map(([id, v]) => ({ id, title: v.title })));
    if (m === 'POST' && p === '/version-projects/transfer') { const from = JSON.parse(r.postData()).from; let n = 0; for (const v of Object.values(db.projects)) if (v.owner === sha(from)) { v.owner = owner; n++; } return j({ moved: n }); }
    const mm = p.match(/^\/version-projects\/([0-9a-f-]{36})\/versions$/);
    if (m === 'POST' && mm) { const pr = db.projects[mm[1]] || (db.projects[mm[1]] = { owner, title: JSON.parse(r.postData()).document.title, versions: 0 }); if (pr.owner !== owner) return j({ error: '이 작업물의 보관함 접근 키가 일치하지 않습니다.' }, 403); pr.versions++; return j({ id: 'v', sequence: pr.versions }, 201); }
    return j({ error: 'nf' }, 404);
  });
  // 초기 저장소: hazel = docA·issueA·keyA, app = (선택) docB·keyB
  const seed = async (url, items) => { const pg = await ctx.newPage(); await pg.route('**/*', rt => rt.fulfill({ status: 200, contentType: 'text/html', body: '<p>seed</p>' })); await pg.goto(url); await pg.evaluate(it => { localStorage.clear(); for (const [k, v] of Object.entries(it)) localStorage.setItem(k, v); }, items); await pg.close(); };
  await seed('https://mapstone-hazel.vercel.app/seed', { 'mapstone.timeline.v1': JSON.stringify(docA), 'mapstone.issueTracker.v2': JSON.stringify(issueA), 'mapstone.version.owner': keyA, 'mapstone.tipHold': '0' });
  await seed('https://mapstone-app.vercel.app/seed', appHasData ? { 'mapstone.timeline.v1': JSON.stringify(docB), 'mapstone.version.owner': keyB } : {});
  const p = await ctx.newPage();
  await p.goto('https://mapstone-hazel.vercel.app/issues.html?x=1#h'); await p.waitForURL(/migrate\.html/); await p.waitForSelector('#mv');
  const summary = await p.textContent('.list');
  const [dl, popup] = await Promise.all([p.waitForEvent('download'), ctx.waitForEvent('page'), p.click('#mv')]);
  const bk = path.join(OUT, `backup-${appHasData ? 'conflict' : 'empty'}.json`); await dl.saveAs(bk);
  await popup.waitForSelector('text=옮기기 완료', { timeout: 20000 }); await p.waitForSelector('.ok', { timeout: 10000 });
  const report = await popup.$$eval('.log li', x => x.map(e => e.textContent.trim()));
  await popup.screenshot({ path: path.join(OUT, `report-${appHasData ? 'conflict' : 'empty'}.png`) });
  const app = await popup.evaluate(() => ({ tl: JSON.parse(localStorage.getItem('mapstone.timeline.v1') || 'null')?.title, it: JSON.parse(localStorage.getItem('mapstone.issueTracker.v2') || 'null')?.title, key: localStorage.getItem('mapstone.version.owner'), kept: Object.keys(localStorage).filter(k => k.startsWith('mapstone.migrated.')), tip: localStorage.getItem('mapstone.tipHold') }));
  let swapped = null;
  if (appHasData) { await popup.click('[data-swap="swap-tl"]'); swapped = await popup.evaluate(() => ({ now: JSON.parse(localStorage.getItem('mapstone.timeline.v1')).title, kept: JSON.parse(localStorage.getItem('mapstone.migrated.mapstone-hazel.vercel.app.mapstone.timeline.v1')).title })); }
  const hazel = await p.evaluate(() => ({ flag: localStorage.getItem('mapstone.migratedTo'), stillHas: !!localStorage.getItem('mapstone.timeline.v1') }));
  // 다시 예전 주소로 오면 새 주소의 같은 경로로 바로 이동
  const p2 = await ctx.newPage(); await p2.goto('https://mapstone-hazel.vercel.app/issues.html?q=1#z'); await p2.waitForURL(/mapstone-app\.vercel\.app/); const redirected = p2.url();
  const backup = JSON.parse(fs.readFileSync(bk, 'utf8'));
  console.log(`\n=== ${appHasData ? '새 주소에도 데이터가 있을 때(충돌)' : '새 주소가 비어 있을 때'} ===`);
  console.log('보내기 요약:', summary.replace(/\s+/g, ' '));
  console.log('백업 파일 키:', Object.keys(backup.items).join(', '));
  report.forEach(l => console.log('  ', l));
  console.log('새 주소 결과:', JSON.stringify(app));
  if (swapped) console.log('바꾸기 후:', JSON.stringify(swapped));
  console.log('서버 소유:', JSON.stringify(Object.fromEntries(Object.entries(db.projects).map(([id, v]) => [id.slice(0, 4), { key: v.owner === sha(keyA) ? 'A' : v.owner === sha(keyB) ? 'B' : '?', versions: v.versions }]))));
  console.log('예전 주소:', JSON.stringify(hazel), '| 재방문 이동:', redirected);
  await b.close();
}
(async () => { await run(false); await run(true); })().catch(e => { console.log('CRASH', e.message); process.exit(1); });
