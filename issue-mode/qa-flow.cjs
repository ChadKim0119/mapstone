// 기본 조작 사용성 E2E 검증 (로컬 서버 http://127.0.0.1:4190/local.html)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const URL = process.env.IM_URL || 'http://127.0.0.1:4191/issues.html';
let pass = 0, fail = 0; const out = [];
const ok = (c, m) => { if (c) { pass++; out.push('PASS ' + m); } else { fail++; out.push('FAIL ' + m); } };
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 }, acceptDownloads: true });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new globalThis.URL(URL).origin });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(URL); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
  const st = () => p.evaluate(() => ({ sel: ui.sel, view: ui.view, n: doc.issues.length, doc: JSON.parse(JSON.stringify(doc)) }));
  const issue = async key => (await st()).doc.issues.find(i => i.key === key);
  const idOf = async key => (await issue(key)).id;

  // 1 선택
  const vdp = await idOf('VDP');
  await p.click(`.tl-l .tl-row[data-row="${vdp}"]`);
  ok((await p.textContent('#insp-head h2')).includes('VDP API 인증 오류'), '이슈 행 클릭 → 인스펙터에 선택 이슈 표시');
  ok(await p.$eval(`.tl-l .tl-row[data-row="${vdp}"]`, e => e.classList.contains('sel')), '선택 행 강조');
  ok((await p.$$('.dep-svg path')).length > 0, '선택 이슈의 의존 연결선 표시');

  // 2 담당 입력 → 캔버스 반영 + 포커스 유지
  await p.fill('#i-owner', '일본 VDP / LG U+ 이준제');
  await p.waitForTimeout(400);
  ok((await p.textContent(`.tl-l .tl-row[data-row="${vdp}"] .own`)).includes('이준제'), '담당 입력 → 타임라인 행에 즉시 반영');
  ok(await p.evaluate(() => document.activeElement.id === 'i-owner'), '입력 중 포커스 유지');

  // 3 점검일 경과
  await p.fill('#i-check', '2026-10-18'); await p.dispatchEvent('#i-check', 'change'); await p.waitForTimeout(250);
  ok((await p.textContent(`.tl-r .tl-row[data-row="${vdp}"]`)).includes('점검일 경과'), '지난 점검일 → 오른쪽 열 "점검일 경과" 경고');
  ok((await p.$$(`.tl-mid .tl-row[data-row="${vdp}"] .flag.late`)).length === 1, '지난 점검일 → 타임라인 점검 플래그');
  ok((await p.textContent('[data-gap="late"]')).includes('1'), '관리 공백 "점검일 경과" 1건');

  // 4 조치 체크/추가
  await p.check('[data-act]'); await p.waitForTimeout(200);
  ok((await p.textContent(`.tl-r .tl-row[data-row="${vdp}"] .prog`)).includes('조치 1/2'), '조치 체크 → 진행률 1/2');
  await p.fill('#n-act', '인증 오류 로그 일본 측 공유'); await p.press('#n-act', 'Enter'); await p.waitForTimeout(200);
  ok((await issue('VDP')).actions.length === 3, '조치 추가 (Enter)');
  ok(await p.evaluate(() => document.activeElement.id === 'n-act'), '조치 추가 후 입력칸 포커스 유지');
  ok(await p.$eval('#f-act button', b => b.disabled), '빈 입력이면 추가 버튼 비활성');

  // 5 메모
  await p.fill('#n-note', '일본 측 회신 10/22 예정'); await p.click('#f-note button'); await p.waitForTimeout(200);
  ok((await p.textContent('.notes')).includes('10/22 예정'), '점검 결과 기록 → 메모 목록');

  // 6 상태 변경 → 자동 기록, 판정
  await p.selectOption('#i-status', 'progress'); await p.waitForTimeout(250);
  ok((await issue('VDP')).notes.some(n => n.sys && n.text.includes('차단 → 진행 중')), '상태 변경 자동 기록');
  ok((await p.textContent('.verdict .big')).includes('차단 4건'), '상태 변경 → 판정 배너 갱신');

  // 7 확인 요청
  await p.click('[data-itab="requests"]');
  const before = (await issue('VDP')).requests.filter(r => r.state !== 'done').length;
  await p.click('[data-req]'); await p.waitForTimeout(150);
  ok((await issue('VDP')).requests[0].state === 'answered', '요청 상태 클릭 → 회신 받음');
  await p.click('[data-req]'); await p.waitForTimeout(150);
  ok((await issue('VDP')).requests.filter(r => r.state !== 'done').length === before - 1, '두 번 클릭 → 확인 완료, 대기 수 감소');
  await p.fill('#n-req', 'getAllDtc 인증 오류 응답 본문 공유'); await p.click('#f-req button'); await p.waitForTimeout(150);
  ok((await issue('VDP')).requests.length === 9, '확인 요청 추가');

  // 8 이력 추가/편집/삭제·되돌리기
  await p.click('[data-itab="history"]');
  await p.fill('#n-evd', '2026-10-22'); await p.fill('#n-evt', '일본 측 인증 정책 회신 예정'); await p.click('#f-ev button'); await p.waitForTimeout(200);
  const evs = (await issue('VDP')).events; const ne = evs.find(e => e.text.includes('회신 예정'));
  ok(ne && ne.kind === 'plan', '기준일 이후 이력 → 자동 "예정"');
  ok((await p.$$(`.tl-mid .tl-row[data-row="${vdp}"] .ev.plan`)).length >= 1, '예정 이력 → 타임라인 점선 카드');
  await p.click(`[data-editev="${ne.id}"]`); await p.fill('#e-t', '일본 측 인증 정책 회신 (수정)'); await p.click('[data-evform] button.primary'); await p.waitForTimeout(150);
  ok((await issue('VDP')).events.some(e => e.text === '일본 측 인증 정책 회신 (수정)'), '이력 편집 저장');
  await p.click(`[data-rmev="${ne.id}"]`); await p.waitForTimeout(150);
  ok(!(await issue('VDP')).events.some(e => e.id === ne.id), '이력 삭제');
  await p.click('#toast-act'); await p.waitForTimeout(200);
  ok((await issue('VDP')).events.some(e => e.id === ne.id), '토스트 되돌리기 → 삭제 복구');

  // 9 타임라인 카드 클릭 → 이력 탭 + 해당 이력 강조
  const e6 = (await issue('VDP')).events.find(e => e.date === '2026-10-06');
  await p.click(`.ev[data-ev="${e6.id}"]`); await p.waitForTimeout(200);
  ok(await p.$eval('[data-itab="history"]', b => b.getAttribute('aria-selected') === 'true'), '이력 카드 클릭 → 원문·이력 탭');
  ok((await p.$$(`.he.flash[data-he="${e6.id}"]`)).length === 1, '클릭한 이력 강조');

  // 10 게이트 단계 (상단)
  const dcm = await idOf('DCM');
  const s0 = (await issue('DCM')).steps[2][1];
  await p.click(`.strip [data-step="2"][data-issue="${dcm}"]`); await p.waitForTimeout(150);
  ok((await issue('DCM')).steps[2][1] !== s0, '상단 게이트 단계 클릭 → 상태 변경');

  // 11 검색·필터
  await p.fill('#q', '내선번호'); await p.waitForTimeout(400);
  ok((await p.$$('.tl-l .tl-row')).length === 1, '검색 "내선번호" → 1건');
  ok(await p.evaluate(() => document.activeElement.id === 'q'), '검색 중 포커스 유지');
  await p.click('#f-clear'); await p.waitForTimeout(150);
  ok((await p.$$('.tl-l .tl-row')).length === 9, '필터 해제 → 9건');
  await p.selectOption('#f-st', 'blocked'); await p.waitForTimeout(150);
  const nb = (await st()).doc.issues.filter(i => i.status === 'blocked').length;
  ok((await p.$$('.tl-l .tl-row')).length === nb, '상태 필터 차단');
  await p.selectOption('#f-st', 'all'); await p.selectOption('#f-gap', 'owner'); await p.waitForTimeout(150);
  ok((await p.$$('.tl-l .tl-row')).length === (await st()).doc.issues.filter(i => !i.owner.trim()).length, '관리 공백 필터 담당 미정');
  await p.selectOption('#f-gap', ''); await p.waitForTimeout(100);

  // 12 그룹 접기
  await p.click('.tl-l [data-grp="Global South"]'); await p.waitForTimeout(150);
  ok((await p.$$('.tl-l .tl-row')).length === 5, '영역 접기 → 4건 숨김');
  await p.click('.tl-l [data-grp="Global South"]'); await p.waitForTimeout(150);

  // 13 키보드 이동
  await p.focus(`.tl-l .tl-row[data-row="${dcm}"]`); await p.keyboard.press('ArrowDown'); await p.waitForTimeout(150);
  ok((await st()).sel !== dcm && (await p.evaluate(() => document.activeElement.classList.contains('tl-row'))), '↓ 키로 다음 이슈 선택·포커스');

  // 14 표 보기·정렬
  await p.click('#lv-l'); await p.waitForTimeout(150);
  ok((await p.$$('.it-table tbody tr')).length === 9, '표 보기 9행');
  await p.click('[data-sort="check"]'); await p.waitForTimeout(150);
  ok((await p.textContent('.it-table tbody tr:first-child')).includes('VDP'), '다음 점검 정렬 → 점검일 있는 VDP가 처음');
  await p.click('.it-table tbody tr:nth-child(3)'); await p.waitForTimeout(150);
  ok(await p.$eval('.it-table tbody tr:nth-child(3)', r => r.classList.contains('sel')), '표 행 클릭 → 선택');
  await p.click('#lv-t'); await p.waitForTimeout(150);

  // 15 이슈 추가·삭제·되돌리기
  await p.click('#b-add'); await p.waitForTimeout(200);
  ok((await st()).n === 10 && await p.evaluate(() => document.activeElement.id === 'i-title'), '이슈 추가 → 제목 입력 포커스');
  await p.fill('#i-title', '신규 점검 이슈'); await p.waitForTimeout(300);
  ok((await p.textContent('.tl-l .tl-row.sel .tt')) === '신규 점검 이슈', '새 이슈 제목 → 타임라인 반영');
  await p.click('#i-del'); await p.waitForTimeout(200);
  ok((await st()).n === 9, '이슈 삭제');
  await p.click('#toast-act'); await p.waitForTimeout(200);
  ok((await st()).n === 10, '삭제 되돌리기');
  ok((await p.textContent('#insp-head h2')) === '신규 점검 이슈', '되돌리기 후 복구된 이슈가 다시 선택됨');
  await p.click('#i-del'); await p.waitForTimeout(150);
  ok((await st()).n === 9 && (await st()).doc.issues.every(i => i.title !== '신규 점검 이슈'), '복구 이슈 다시 삭제 시 원래 9건 유지');

  // 16 선행 이슈 연결
  const dms = await idOf('DMS'), opw = await idOf('OPW');
  await p.click(`.tl-l .tl-row[data-row="${opw}"]`); await p.click('[data-itab="manage"]');
  await p.click('summary:has-text("선행 이슈")'); await p.check(`[data-dep="${vdp}"]`); await p.waitForTimeout(150);
  ok((await issue('OPW')).dependsOn.includes(vdp), '선행 이슈 체크 → 의존 추가');
  ok((await p.$$(`.tl-r .tl-row[data-row="${opw}"] .chip.lock`)).length === 2, '오른쪽 열 선행 조건 칩 2개');
  await p.click(`.tl-r .tl-row[data-row="${opw}"] [data-jump="${dms}"]`); await p.waitForTimeout(150);
  ok((await st()).sel === dms, '선행 칩 클릭 → 선행 이슈로 이동');

  // 17 QA 분류 편집
  await p.click('#b-qa'); await p.waitForTimeout(150);
  await p.fill('[data-qr="0"][data-qk="total"]', '330'); await p.waitForTimeout(100);
  ok(await p.$eval('#qa-save', b => b.disabled), '분류 합계 불일치 → 반영 비활성');
  ok((await p.$$('#qa-body .err')).length === 1, '불일치 경고 표시');
  await p.fill('[data-qr="0"][data-qk="other"]', '246'); await p.waitForTimeout(100);
  ok(!(await p.$eval('#qa-save', b => b.disabled)), '합계 맞으면 반영 가능');
  await p.click('#qa-save'); await p.waitForTimeout(200);
  ok((await p.textContent('.kpis .kpi .val')).includes('858'), 'KPI 전체 TC 갱신');
  await p.keyboard.press('Control+z'); await p.waitForTimeout(200);
  ok((await p.textContent('.kpis .kpi .val')).includes('854'), 'Ctrl+Z 되돌리기');

  // 18 새로고침 유지
  await p.reload(); await p.waitForTimeout(400);
  const v2 = await issue('VDP');
  ok(v2.owner.includes('이준제') && v2.checkDate === '2026-10-18' && v2.actions.length === 3, '새로고침 후 담당·점검일·조치 유지');

  // 19 파일 저장 → 불러오기
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#b-save')]);
  const fp = require('os').tmpdir() + '/mapstone-issues-saved.json'; await dl.saveAs(fp);
  ok(JSON.parse(fs.readFileSync(fp, 'utf8')).issues.length === 9, '파일 저장 JSON');

  // 20 텍스트 입력 (규칙 기반)
  await p.click('#b-import'); await p.waitForTimeout(150);
  ok(await p.evaluate(() => document.activeElement.id === 'im-src'), '입력 창 열면 원문 칸 포커스');
  ok(await p.$eval('#im-run', b => b.disabled) || (await p.inputValue('#im-src')).length > 12, '빈 원문이면 정리 버튼 비활성');
  await p.click('#im-ex'); await p.click('#im-run'); await p.waitForTimeout(300);
  ok(await p.$('.im-ask') && (await p.textContent('.im-ask h3')).includes('금일'), '원문에 "금일" → 보고 기준일 질문');
  ok(await p.$eval('[name=im-ask]:checked', x => x.value) === '2026-10-20' && (await p.textContent('.im-ask')).includes('10월 20일 기준'), '질문 기본값 = 원문 기준일(10월 20일 기준)');
  await p.click('#im-ask-ok'); await p.waitForTimeout(300);
  ok((await p.textContent('.rv-sum')).includes('보고 기준일 2026-10-20'), '선택한 날짜가 보고 기준일로 표시');
  const rvN = await p.$$eval('.rv', x => x.length);
  ok(rvN >= 7, `규칙 기반 정리 → 이슈 ${rvN}개 초안`);
  await p.fill('.rv input[data-k="title"]', '검토 중 수정한 제목'); await p.click('#im-apply'); await p.waitForTimeout(300);
  ok((await st()).doc.issues.some(i => i.title === '검토 중 수정한 제목'), '초안 수정 → 반영');
  const im = (await st()).doc;
  ok(im.metrics.length === 3 && im.issues.some(i => i.requests.length >= 8) && im.issues.some(i => i.events.length >= 8), '반영 문서: QA 3영역 · VDP 요청 8+ · 이력 8+');
  await p.click('#toast-act'); await p.waitForTimeout(200);
  ok((await st()).doc.issues.some(i => i.owner.includes('이준제')), '반영 되돌리기 → 이전 문서 복구');

  // 21 JSON 파일 열기
  await p.click('#b-import'); await p.setInputFiles('#im-fin', fp); await p.waitForTimeout(300);
  ok((await p.$$('.rv')).length === 9, 'JSON 파일 열기 → 검토 단계');
  await p.keyboard.press('Escape'); await p.waitForTimeout(100);
  ok(!(await p.$('.modal')), 'Esc로 입력 창 닫기');

  // 21-1 상대 날짜 원문 → 과거 보고 기준일로 해석
  const keepDoc = (await st()).doc;
  await p.click('#b-import'); await p.fill('#im-src', '1. 결제 API 장애\n금일 오전 10시 서버 재기동 완료\n어제 오후 인증 오류 발생\n내일 재배포 예정\n담당: 플랫폼팀'); await p.click('#im-run'); await p.waitForTimeout(200);
  ok((await p.$$('.im-snips li')).length >= 2 && (await p.$$('.im-snips mark')).length >= 2, '상대 날짜가 쓰인 문장을 강조해 보여줌');
  await p.click('[name=im-ask][value=custom]'); await p.fill('#im-ask-d', '2026-10-15'); await p.click('#im-ask-ok'); await p.waitForTimeout(300);
  ok((await p.textContent('.rv-sum')).includes('2026-10-15') && (await p.textContent('.im-lag')).includes('5일 전'), '직접 고른 과거 기준일 + 경과 안내');
  await p.click('#im-apply'); await p.waitForTimeout(300);
  const rd = (await st()).doc, rev = rd.issues[0].events.map(e => e.date + e.kind).sort();
  ok(JSON.stringify(rev) === JSON.stringify(['2026-10-14fail', '2026-10-15ok', '2026-10-16plan']), '금일/어제/내일 → 기준일로 환산 ' + rev.join(','));
  ok(rd.asOf === '2026-10-15' && rd.now === '2026-10-20' && !rd.nowManual, '보고 기준일과 NOW(오늘) 분리');
  ok((await p.textContent('.doc-eyebrow')).includes('보고 후 5일 경과'), '보고 후 경과일 표시');
  ok((await p.$$('.tl-mid .ev.due')).length === 1 && (await p.textContent('.ev.due')).includes('예정일 지남'), '지난 예정 이력 → "예정일 지남 · 결과 확인"');
  ok((await p.$$('.tl-rep')).length === 1 && (await p.$$('.tl-now')).length === 2, 'NOW 위·아래 표시 + 보고 기준일 표시');

  // 21-2 NOW 드래그 · 더블클릭 · 방향키
  const pill = await p.$('.tl-now.top'), bx = await pill.boundingBox();
  const tx = await p.evaluate(() => { const d = [...document.querySelectorAll('.tl-mid .tl-day:not(.gap)')].find(e => e.firstChild.textContent.trim() === '18'); const r = d.getBoundingClientRect(); return r.left + r.width / 2; });
  await p.mouse.move(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.mouse.down();
  for (let k = 1; k <= 12; k++) { await p.mouse.move(bx.x + bx.width / 2 + (tx - bx.x - bx.width / 2) * k / 12, bx.y + bx.height / 2); await p.waitForTimeout(16); }
  const mid = await p.evaluate(() => [document.querySelector('.tl-now.top').textContent, document.querySelector('.tl-now.bottom').textContent]);
  ok(mid[0] === mid[1] && mid[0].includes('10.18'), '드래그 중 NOW 위·아래 라벨이 함께 이동 ' + mid[0]);
  await p.mouse.up(); await p.waitForTimeout(250);
  let nd = (await st()).doc;
  ok(nd.now === '2026-10-18' && nd.nowManual, 'NOW 드래그 → 날짜 이동 저장');
  ok(await p.$('#b-now-today') && (await p.inputValue('#now-in')) === '2026-10-18', 'NOW 이동 → 문서 머리에 NOW 날짜 + 오늘로 버튼');
  await p.fill('#now-in', '2026-10-15'); await p.dispatchEvent('#now-in', 'change'); await p.waitForTimeout(200);
  ok((await p.$$('.tl-mid .ev.due')).length === 0 && (await p.textContent('.doc-eyebrow')).includes('보고 후') === false, 'NOW 입력으로 예정일 이전 이동 → 예정 표시 복귀');
  await p.focus('.tl-now.top'); await p.keyboard.press('Shift+ArrowRight'); await p.waitForTimeout(200);
  ok((await st()).doc.now === '2026-10-22' && await p.evaluate(() => document.activeElement.dataset.now === 'top'), 'Shift+→ 7일 이동 · 포커스 유지');
  await p.dblclick('.tl-now.bottom'); await p.waitForTimeout(250);
  nd = (await st()).doc;
  ok(nd.now === '2026-10-20' && !nd.nowManual && !(await p.$('#b-now-today')), 'NOW 더블클릭 → 오늘로 복귀');
  await p.reload(); await p.waitForTimeout(300);
  ok((await st()).doc.now === '2026-10-20', '새로 열면 NOW는 오늘');
  await p.evaluate(d => { doc = normalizeDoc(d); persist(true); render(); }, keepDoc); await p.waitForTimeout(200);
  ok((await st()).doc.issues.length === keepDoc.issues.length, 'NOW 검증용 문서 정리 후 기존 문서 복구');

  // 22 보고 화면
  await p.click('#v-r'); await p.waitForTimeout(250);
  ok((await p.$$('.hero')).length === 1 && (await p.$$('#r-canvas .tl-row')).length > 0, '보고 요약: 히어로 + 읽기 전용 타임라인');
  await p.click('#rt-scenario'); await p.waitForTimeout(150);
  await p.check(`[data-assume="${vdp}"]`); await p.waitForTimeout(150);
  console.log('FREED', await p.evaluate(() => scenarioState().filter(s => s.freed).map(s => s.i.key + '<' + s.deps.map(d => d.key + ':' + d.status).join(','))));
  const sumT = await p.textContent('.scn-sum'); const dmsCard = await p.textContent(`.sc:has([data-open="${dms}"])`);
  ok(sumT.includes('선행 조건이 풀리는 이슈 1') && dmsCard.includes('선행 조건 해소 가정'), 'VDP 해소 가정 → DMS 선행 조건 해제 [' + sumT.slice(0,40) + ']');
  ok((await issue('VDP')).status === 'progress', '가정은 실제 상태를 바꾸지 않음');
  await p.click('#b-reset-assume'); await p.waitForTimeout(150);
  ok((await p.textContent('.scn-sum')).includes('0개 조건'), '가정 초기화');
  await p.click('#rt-requests'); await p.waitForTimeout(150);
  await p.click('[data-copy]'); await p.waitForTimeout(200);
  const clip = await p.evaluate(() => navigator.clipboard.readText().catch(() => ''));
  ok(clip.includes('확인 요청') && clip.includes('■'), '요청 문안 복사');
  const before2 = await p.$$eval('.preq .stbtn', x => x.map(e => e.className).join());
  await p.click('.preq:nth-of-type(3) .stbtn'); await p.waitForTimeout(150);
  ok(before2 !== await p.$$eval('.preq .stbtn', x => x.map(e => e.className).join()), '보고 화면에서 요청 상태 변경');
  await p.click('#rt-summary'); await p.waitForTimeout(150);
  await p.click('.queue .qi'); await p.waitForTimeout(200);
  ok((await st()).view === 'manage', '보고 화면 항목 클릭 → 관리 화면 이동');

  ok(errs.length === 0, '콘솔/페이지 오류 없음' + (errs.length ? ': ' + errs.join(' | ') : ''));
  console.log(out.join('\n')); console.log(`\n${pass} passed, ${fail} failed`);
  await b.close();
})().catch(e => { console.log(out.join('\n')); console.log('CRASH', e.message); process.exit(1); });
