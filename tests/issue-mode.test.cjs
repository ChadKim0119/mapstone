const { test } = require('node:test'); const assert = require('node:assert/strict'); const fs = require('node:fs'), vm = require('node:vm');
const sample = fs.readFileSync('issue-mode/sample.txt', 'utf8');
function load() {
  const ctx = { console, document: { getElementById: id => id === 'sample-text' ? { textContent: sample } : null } };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync('issue-mode/model.js', 'utf8') + '\n' + fs.readFileSync('issue-mode/data.js', 'utf8') + '\n;this.M={normalizeDoc,parseRules,metricTotals,metricWarnings,sampleDoc,claudePrompt,dateContext,todayISO};', ctx);
  return ctx.M;
}
test('Rule-based parsing turns the DVT report into tracked issues without inventing dates or owners', () => {
  const M = load(), d = M.normalizeDoc(M.parseRules(sample, {}));
  assert.equal(d.asOf, '2026-10-20');
  assert.ok(d.issues.length >= 7 && d.issues.length <= 12);
  const t = M.metricTotals(d.metrics); assert.deepEqual([t.total, t.blocked, t.limited, t.other], [854, 343, 142, 369]);
  const vdp = d.issues.find(i => i.key === 'VDP'); assert.ok(vdp.events.length >= 8); assert.ok(vdp.requests.length >= 8);
  assert.ok(vdp.events.some(e => e.flag === '*')); assert.ok(vdp.events.some(e => e.corrected));
  assert.ok(d.issues.every(i => i.checkDate === ''), 'no invented check dates');
  assert.ok(d.issues.find(i => i.key === 'DCM').scenario.success.includes('50건'));
  assert.equal(d.reasons.reported, 84); assert.equal(d.reasons.rows.reduce((a, r) => a + r.count, 0), 78);
  assert.ok(d.issues.find(i => i.key === 'DMS').impact.unit === 'API');
  assert.ok(d.conclusion.points.length === 3);
});
test('Plain bullet memo without tables still yields editable issues', () => {
  const M = load(), d = M.normalizeDoc(M.parseRules('- 결제 API 인증 오류\n현재 인증 오류로 주문 확인 불가\n담당: 플랫폼팀\n- 검색 색인 지연\n10/20 색인 재처리 실패', { asOf: '2026-10-20' }));
  assert.equal(d.issues.length, 2); assert.equal(d.issues[0].owner, '플랫폼팀'); assert.equal(d.issues[1].events[0].date, '2026-10-20');
  assert.throws(() => M.parseRules('짧음', {}));
});
test('Document normalization clamps values, maps dependency keys and drops broken links', () => {
  const M = load();
  const d = M.normalizeDoc({ asOf: 'bad', issues: [{ key: 'A', title: '', priority: 99, status: 'x', dependsOn: ['B', 'missing'], events: [{ date: '2026-13-40', text: 't' }], impact: { count: -3, unit: 'API' } }, { key: 'B', title: 'b' }] });
  assert.equal(d.issues[0].title, '새 이슈'); assert.equal(d.issues[0].priority, 9); assert.equal(d.issues[0].status, 'pending');
  assert.equal(JSON.stringify(d.issues[0].dependsOn), JSON.stringify([d.issues[1].id])); assert.equal(d.issues[0].events[0].date, ''); assert.equal(d.issues[0].impact.count, 0);
  assert.throws(() => M.normalizeDoc(null));
  assert.equal(M.metricWarnings([{ label: 'X', total: 10, blocked: 3, limited: 3, other: 3 }]).length, 1);
});
test('Example document and Claude prompt keep QA classification separate from Pass/Fail', () => {
  const M = load(), d = M.sampleDoc();
  assert.equal(d.issues.length, 9); assert.ok(d.issues.find(i => i.key === 'OPW').dependsOn.length === 1);
  assert.match(M.claudePrompt('원문', { asOf: '2026-10-20' }), /Pass\/Fail 결과가 아니다/);
});
test('Build exposes issue mode as a separate entry linked from the milestone header', () => {
  const src = fs.readFileSync('src/timeline.dc.html', 'utf8'), issues = fs.readFileSync('issues.html', 'utf8'), vercel = fs.readFileSync('vercel.json', 'utf8');
  assert.match(src, /class="ms-mode-switch"[\s\S]*?href="\{\{ issueModeHref \}\}"/);
  assert.match(src, /modeIssue: '이슈관리 모드'/); assert.match(src, /modeIssue: '課題管理モード'/);
  const ver = src.match(/APP_VER = '([^']+)'/)[1]; assert.ok(issues.includes(`const APP_VER = "${ver}"`));
  assert.ok(issues.includes("assets/design-system/PretendardVariable.woff2")); assert.ok(!/__FONT__/.test(issues));
  assert.match(vercel, /issues\.html/);
});
test('Relative date words are detected and resolved against the report date, not the input day', () => {
  const M = load(), c = M.dateContext(sample);
  assert.equal(c.basis, '2026-10-20'); assert.ok(c.rel.some(r => r.word === '금일'));
  const memo = '1. 결제 API 장애\n금일 오전 10시 서버 재기동 완료\n어제 오후 인증 오류 발생\n내일 재배포 예정\n담당: 플랫폼팀';
  const m = M.dateContext(memo); assert.equal(m.hasDates, false); assert.equal(m.rel.length, 3); assert.deepEqual([...m.rel[0].words], ['금일', '오전']);
  const d = M.normalizeDoc(M.parseRules(memo, { asOf: '2026-10-15' }));
  assert.equal(JSON.stringify(d.issues[0].events.map(e => e.date + ' ' + e.kind).sort()), JSON.stringify(['2026-10-14 fail', '2026-10-15 ok', '2026-10-16 plan']));
  assert.match(M.claudePrompt(memo, { asOf: '2026-10-15' }), /상대 날짜 표현은 보고 기준일 2026-10-15/);
});
test('NOW is stored separately from the report date and only kept when moved by hand', () => {
  const M = load(), today = M.todayISO();
  const a = M.normalizeDoc({ asOf: '2026-10-15', issues: [] }); assert.equal(a.asOf, '2026-10-15'); assert.equal(a.now, today); assert.equal(a.nowManual, false);
  const b = M.normalizeDoc({ asOf: '2026-10-15', now: '2026-10-18', nowManual: true, issues: [] }); assert.equal(b.now, '2026-10-18'); assert.equal(b.nowManual, true);
  assert.equal(M.normalizeDoc({ now: 'bad', nowManual: true, issues: [] }).nowManual, false);
  const app = fs.readFileSync('issue-mode/app.js', 'utf8');
  assert.match(app, /if \(!doc\.nowManual\) doc\.now = todayISO\(\)/); assert.match(app, /ondblclick = e => \{ e\.stopPropagation\(\); setNow\(todayISO\(\), false\)/);
});
test('Mode switch keeps the milestone header geometry and design tokens across both modes', () => {
  const css = fs.readFileSync('issue-mode/style.css', 'utf8'), shell = fs.readFileSync('scripts/bundle-base.html', 'utf8'), src = fs.readFileSync('src/timeline.dc.html', 'utf8'), issues = fs.readFileSync('issues.html', 'utf8'), index = fs.readFileSync('index.html', 'utf8').slice(0, 20000);
  assert.doesNotMatch(css, /font-weight:800/); assert.doesNotMatch(css, /linear-gradient\(110deg/);
  assert.match(css, /--h-ctl:32px/); assert.match(css, /--r-ctl:12px/); assert.match(css, /\.brand\{[^}]*padding:5px 15px 5px 0[^}]*view-transition-name:ms-brand/);
  for (const t of [css, shell, src]) assert.match(t, /@view-transition\s*\{\s*navigation:\s*auto;?\s*\}/);
  assert.match(src, /\.ms-mode-switch \{ view-transition-name:ms-mode; \}/); assert.match(shell, /view-transition-name: ms-mode/);
  assert.match(index, /class="ms-boot-switch"/); assert.ok(index.includes('<span class="ms-boot-ver">' + src.match(/APP_VER = '([^']+)'/)[1] + '</span>'));
  assert.match(issues, /<script type="speculationrules">\{"prerender":\[\{"where":\{"selector_matches":"#m-ms"\}/);
  assert.match(src, /if \(this\._saveBlocked \|\| document\.prerendering\) return;/); assert.match(fs.readFileSync('issue-mode/app.js', 'utf8'), /if \(document\.prerendering\) return; \/\/ 미리 준비 중에는 저장하지 않음/);
});
test('Timeline pins its header to the top of the page with native sticky and syncs the date axis with a scroll timeline', () => {
  const css = fs.readFileSync('issue-mode/style.css', 'utf8'), app = fs.readFileSync('issue-mode/app.js', 'utf8');
  assert.match(css, /\.canvas\{overflow:clip;/); assert.doesNotMatch(css, /\.tl-scroll\{/);
  assert.match(css, /\.tl-hrow\{position:sticky;top:0/); assert.match(css, /\.tl-frow\{position:sticky;bottom:0/);
  assert.match(css, /\.tl-mid\{overflow-x:auto;overflow-y:hidden;[^}]*scroll-timeline:--tlx x\}/); assert.match(css, /\.tl-hin,\.tl-fin\{[^}]*animation-timeline:--tlx/);
  assert.match(css, /\.appbar\{position:relative;/);
  assert.doesNotMatch(app, /syncStickyHeads|addEventListener\('scroll'/); assert.doesNotMatch(app, /R\.style\.position/);
  assert.match(app, /const SCROLL_TIMELINE = /); assert.ok(fs.existsSync('issue-mode/qa-scroll.cjs'));
});
