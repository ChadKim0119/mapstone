/* ================= 예제 문서 (27CY SU#2 2차 DVT) ================= */
function sampleDoc() {
  const ev = (date, kind, text, o = {}) => ({ id: uid(), date, kind, text, flag: o.flag || '', corrected: !!o.corrected, evidence: o.evidence || '' });
  const rq = (party, text) => ({ id: uid(), party, text, state: 'open', at: '' });
  const ac = text => ({ id: uid(), text, done: false });
  const T0 = '2026-10-20T09:00:00.000Z';
  const issues = [
    {
      key: 'DCM', title: '대체 DCM 수령 · ADF 정상화', group: 'Global South', area: 'GS · DCM', priority: 1, status: 'progress',
      owner: 'LGE / LG U+ / DasanDMC', checkDate: '', summary: '기존 DCM 2대 모두 ADF 수행 불가. 대체 DCM 2대는 LG U+ 전달 완료, DasanDMC로 퀵배송 예정입니다.',
      gate: '대체 DCM 수령 → CV용 펌웨어·통신 확인 → ACOS 연동 · ADF 정상 수행 확인',
      impact: { count: 50, unit: 'TC', text: 'ADF 선행 N/T 50건 수행 가능 여부 재검토 · DCM 연계 Fail 재검증' },
      constraint: { text: '기존 DCM 2대 ADF 수행 불가 · CV 테스트 환경 없음', start: '2026-10-19', tone: 'red' },
      steps: [['LGE 변경', 'done'], ['전달·배송', 'current'], ['FW·통신', 'todo'], ['ACOS·ADF', 'todo']],
      dependsOn: [],
      actions: [ac('대체 DCM 2대 DasanDMC 수령 확인'), ac('수령 후 펌웨어 및 통신 환경 확인'), ac('ACOS 연동 및 ADF 정상 수행 검증'), ac('DCM② 인증서 문제 원인 확정')],
      events: [
        ev('2026-10-19', 'fail', 'DCM① 1A↔CV SIM 사양 상이 확인 (LGE 회신) · 펌웨어 변경만으로 CV 사용 불가', { evidence: '10월 19일 LGE 확인 결과, 1A용 DCM과 CV용 DCM의 SIM 사양이 상이하여 단순 펌웨어 변경만으로는 CV용으로 사용할 수 없다는 답변을 받음' }),
        ev('', 'fail', 'DCM② 24DCM CV → SU#2 펌웨어 변경 후 ADF 실패 · 인증서 문제 추정', { flag: '~', evidence: '현재 인증서 문제로 추정하고 있음 … ACOS 접속 과정에서 인증서 검증이 정상적으로 이루어지지 않은 것으로 판단' }),
        ev('2026-10-20', 'fact', '대체 DCM 2대 LG U+ 박준현 책임에게 전달 (#1 CV용 변경 · #2 LGE 보유 시료로 대체)', { evidence: '해당 DCM 2대가 LG U+ 박준현 책임에게 전달됨' }),
        ev('2026-10-20', 'plan', 'LG U+ 김창목 책임 경유 DasanDMC 퀵배송 예정', { evidence: 'LG U+ 김창목 책임을 통해 DasanDMC로 퀵배송 진행 예정' })],
      requests: [rq('LGE / DasanDMC', 'DCM② ACOS 접속용 Root CA 인증서 및 인증서 체인 구성 확인 (추정 원인 확정)')],
      scenario: { success: 'ADF 선행 50건부터 수행 가능 여부를 재검토하고, 1차 DVT에서 Block된 GS N/T·Fail 대부분을 재검증합니다. DCM 기반 REST/MQTT·차량 업무 Flow도 검증합니다.', failure: 'DCM 기반 테스트 환경을 확보하지 못해 DCM 연계 N/T·Fail 재검증이 제한됩니다. GS 2차 결과는 1차와 유의미한 차이가 없을 가능성이 높습니다.' },
      evidence: ['현재 27CY SU#2 CV 테스트를 위해 보유하고 있는 DCM은 총 2대이며, 모두 ADF가 정상적으로 수행되지 않아 테스트에 활용할 수 없는 상황입니다.', '대체 DCM의 ADF 정상 수행 여부를 최우선으로 확인하고, 그 결과에 따라 Global South의 2차 DVT 테스트 수행 범위를 확정할 예정입니다.']
    },
    {
      key: 'VDP', title: 'VDP API 인증 오류', group: 'e-Care', area: 'e-Care · VDP', priority: 2, status: 'blocked',
      owner: '일본 VDP / LG U+ / DasanDMC', checkDate: '', summary: '신규 VDP 서버 3개 TCP 연결은 정상. getAllDtc 호출 시 인증 오류로 실제 API 응답을 받지 못했습니다.',
      gate: '정확한 STG URL·필수 Header·인증 정책 확인 → 송신 IP 화이트리스트 확인 → getAllDtc 정상 응답',
      impact: { count: null, unit: 'TC', text: 'VDP/VEP 연계 E2E 및 DMS 연동 시나리오 검증 제한 · 영향 TC 수 미확정' },
      constraint: { text: '일본 VDP 접속·인증 협의 · 실제 API 연동 미완료', start: '2026-09-30', tone: 'red' },
      steps: [['접속 대상', 'done'], ['TCP 3/3', 'done'], ['API 인증', 'fail'], ['E2E', 'todo']],
      dependsOn: [],
      actions: [ac('일본 측 인증 정책 회신 받기'), ac('인증 오류 원인 확인 후 getAllDtc 재검증')],
      events: [
        ev('2026-09-30', 'fact', 'TSP(VEP) 주소·IP·수신용 x-api-key 전달 · 일본 측 호출용 키 미수신', { evidence: 'LG U+ 이준제 책임이 일본 측에 TMKR TSP(VEP) 서버 주소·IP 및 수신용 x-api-key 전달' }),
        ev('2026-10-01', 'fact', 'NAT IP 3개 확인 · CoCo는 JSON-RPC, IP 화이트리스트만 필요하다는 안내', { evidence: '니시무라 님이 제공 IP 3개가 NAT IP임을 확인. Liu Zhifan 님이 CoCo는 JSON-RPC 방식으로 IP 화이트리스트 등록만 필요하다고 안내' }),
        ev('2026-10-06', 'fail', 'IP 3개 × 443/8080/80 포트 접속 시험 9건 · 전체 TCP Connection Timeout'),
        ev('2026-10-13', 'warn', '“curl 성공·PrivateLink, 설정 문제 없음” 안내 → 다른 연결 구간 답변으로 확인', { corrected: true }),
        ev('2026-10-14', 'warn', '접속 대상 정정: 한국 TSP는 VDP CoCo 주소로 접속해야 함', { flag: '*' }),
        ev('2026-10-16', 'warn', '기존 IP는 VDP Diag 플랫폼 주소 · CoCo STG URL 3개와 IF 규격서 공유', { flag: '*' }),
        ev('2026-10-20', 'ok', '신규 VDP 서버 3개 TCP 연결 정상'),
        ev('2026-10-20', 'fail', 'getAllDtc 호출 → API 인증 오류 발생')],
      requests: [
        rq('일본 VDP', 'All DTC / SSR Center Request의 정확한 STG API URL'), rq('일본 VDP', '전달받은 CoCo STG 엔드포인트의 호출 대상 적합성'),
        rq('일본 VDP', '실제 API 호출 시 필요한 필수 Header 및 인증 정보'), rq('일본 VDP', 'x-api-key 적용 필요 여부 · 불필요하면 실제 인증 방식'),
        rq('일본 VDP', '현재 발생하는 인증 오류의 정확한 원인'), rq('일본 VDP', 'API Gateway 및 접근 권한 설정 상태'),
        rq('일본 VDP', '한국 TSP(VEP) 송신 IP 화이트리스트 등록 여부'), rq('일본 VDP', '일본 측 접근 제어 정책 및 설정 상태')],
      scenario: { success: 'VDP/VEP 연계 E2E 검증과 VDP 의존 DMS 연동 시나리오를 진행할 수 있습니다.', failure: 'TCP 연결과 별개로 VDP 연계 E2E 제약이 유지됩니다. 일본 측 인증 정책·접근 권한과 실제 오류를 대조해 재점검합니다.' },
      evidence: ['10월 20일 기준으로 새로 전달받은 VDP 서버 3개에 대한 TCP 연결은 모두 정상적으로 확인되었습니다.', '실제 API 통신 여부를 확인하기 위해 getAllDtc를 호출하였으나 인증 오류가 발생하여 정상적인 API 응답을 수신하지 못하였습니다.']
    },
    {
      key: 'CCW', title: 'CCW CTI 테스트 환경 확보', group: 'e-Care', area: 'e-Care · CCW', priority: 3, status: 'blocked',
      owner: '', checkDate: '', summary: 'e-Care용 CTI 내선번호와 CAN Configuration 파일이 없어 CCW 236건 전체를 수행할 수 없습니다.',
      gate: 'CTI 내선번호와 CAN Configuration 파일 모두 확보 → CTI 연동 구성 확인',
      impact: { count: 236, unit: 'TC', text: 'CCW 236건 전량 N/T · DCM/VDP 정상화와 무관' },
      constraint: { text: 'CTI 내선번호 · CAN Configuration 미확보', start: '', tone: 'red' },
      steps: [], dependsOn: [],
      actions: [ac('CTI 환경 확보 담당 주체 지정'), ac('CTI 내선번호 확보'), ac('CAN Configuration 파일 확보')],
      events: [],
      requests: [rq('CTI 관련 부문', 'e-Care용 CTI 내선번호 확보 일정'), rq('CTI 관련 부문', 'CAN Configuration 파일 확보 일정 및 담당 주체')],
      scenario: { success: 'CCW 기능 및 연계 시나리오 236건의 수행 가능 여부를 QA가 다시 분류합니다.', failure: 'CTI 내선번호 또는 CAN Configuration 파일 중 하나라도 없으면 CCW 전체 수행 제약이 유지됩니다.' },
      evidence: ['CCW는 현재 QA 기준 수행 불가 건수가 가장 많은 영역으로, 테스트 환경 확보 일정 및 담당 주체에 대한 확인이 필요합니다.']
    },
    {
      key: 'DMS', title: 'DMS 24 API · 연동 검증', group: 'DMS', area: 'DMS', priority: 4, status: 'pending',
      owner: 'DMS / DasanDMC', checkDate: '', summary: '24개 API를 2차 DVT에서 검증할 예정. API 단위 검증부터 진행하고 VDP 연계 E2E는 환경 정상화 후 진행합니다.',
      gate: 'API별 요청/응답·데이터 정합성 검증 범위 확정 · VDP 의존 항목 분리',
      impact: { count: 24, unit: 'API', text: '24개 API 검증 계획 · TC 건수와 별도' },
      constraint: null, steps: [], dependsOn: ['VDP'],
      actions: [ac('API 단위 검증 가능 항목부터 착수'), ac('VDP 연계 필요 항목 목록 분리')],
      events: [], requests: [],
      scenario: { success: 'API 단위 검증에 더해 DMS–VDP 연계 E2E와 1차 미수행 연동 시나리오를 검증합니다.', failure: 'API 단위 검증만 진행하고, VDP 연계가 필요한 항목은 제한 범위로 따로 기록합니다.' },
      evidence: ['DMS 테스트는 API 단위 검증이 가능한 항목부터 진행하고, VDP 연계가 필요한 항목은 관련 환경 정상화 이후 진행하는 방향으로 검토할 예정입니다.']
    },
    {
      key: 'OPW', title: 'OPW 제한 검증 · DMS 연동 구분', group: 'e-Care', area: 'e-Care · OPW', priority: 4, status: 'progress',
      owner: '', checkDate: '', summary: 'DMS 연동이 필요한 23건은 수행 불가. 에뮬레이터 기반 142건은 DTC·필터 등록으로 제한적 검증이 가능합니다.',
      gate: 'DMS 연동 환경 확보 후 23건 재분류 · 에뮬레이터 검증은 실제 E2E와 구분 기록',
      impact: { count: 23, unit: 'TC', text: 'N/T 23건 · 제한적 142건 (실제 차량·VDP/VEP E2E와 구분)' },
      constraint: { text: 'N/T 23건 · DMS 연동 필요', start: '', tone: 'amber' },
      steps: [], dependsOn: ['DMS'],
      actions: [ac('에뮬레이터 142건 검증 범위 확정'), ac('DMS 연동 23건 재확인 일정 확인')],
      events: [], requests: [],
      scenario: { success: 'DMS 연동 23건의 수행 가능 여부를 재확인하고, 에뮬레이터 검증과 실제 E2E 결과를 나눠 보고합니다.', failure: '에뮬레이터 142건만 제한적으로 검증하고 전체 E2E 완료로 보고하지 않습니다.' },
      evidence: ['에뮬레이터 기반 테스트는 DTC 및 필터 등록을 통한 제한적인 기능 검증이므로, 실제 차량에서 발생한 진단 데이터가 VDP/VEP를 거쳐 OPW 등 관련 시스템으로 전달되는 전체 업무 Flow에 대한 E2E 검증과는 구분하여 관리할 필요가 있습니다.']
    },
    {
      key: 'HU', title: 'HU 테스트 환경 구성', group: 'Global South', area: 'GS · HU', priority: 5, status: 'blocked',
      owner: '관련 개발·시험 부문', checkDate: '', summary: 'HU 환경이 구성되지 않아 22건을 수행할 수 없습니다. ADF 정상화와 별개의 제약입니다.',
      gate: 'HU 테스트 환경 구성 → 관련 TC 수행',
      impact: { count: 22, unit: 'TC', text: 'HU 연계 22건 N/T · ADF 정상화와 별도' },
      constraint: { text: 'HU 환경 미구성', start: '', tone: 'red' },
      steps: [], dependsOn: [], actions: [ac('HU 환경 구성 일정 확인')], events: [], requests: [],
      scenario: { success: 'HU 연계 22건의 수행 가능 여부를 다시 분류합니다.', failure: 'ADF가 정상화되어도 HU 연계 테스트는 제한됩니다.' },
      evidence: ['HU 환경 구성 22건 및 DK 서버 연동 미구현 2건 등은 ADF 정상화만으로 해결되지 않는 별도 제약 사항이므로 추가 대응이 필요합니다.']
    },
    {
      key: 'DK', title: 'DK 서버 연동 구현', group: 'Global South', area: 'GS · DK', priority: 6, status: 'blocked',
      owner: '관련 개발 부문', checkDate: '', summary: 'DK 서버 연동이 구현되지 않아 2건을 수행할 수 없습니다.',
      gate: 'DK 서버 연동 기능 구현 → 테스트 환경 확인',
      impact: { count: 2, unit: 'TC', text: 'DK 관련 2건 N/T' },
      constraint: { text: 'DK 서버 연동 미구현', start: '', tone: 'red' },
      steps: [], dependsOn: [], actions: [ac('DK 연동 구현 일정 확인')], events: [], requests: [],
      scenario: { success: 'DK 관련 2건의 수행 가능 여부를 다시 분류합니다.', failure: 'ADF 정상화와 별개로 DK 연동 제약이 남습니다.' },
      evidence: []
    },
    {
      key: 'ENV', title: 'GS 기타 환경 제약', group: 'Global South', area: 'GS · 기타', priority: 6, status: 'blocked',
      owner: '', checkDate: '', summary: 'DCM 장비 부족 3건, 링크 기반 App 설치 방식 제약 1건이 남아 있습니다.',
      gate: '추가 DCM 테스트 환경 확보 · 링크 기반 App 설치 환경 확보',
      impact: { count: 4, unit: 'TC', text: '장비 부족 3건 · App 설치 1건' },
      constraint: { text: '장비 부족 3 · App 설치 1', start: '', tone: 'amber' },
      steps: [], dependsOn: [], actions: [ac('추가 DCM 확보 가능 여부 확인'), ac('링크 기반 App 설치 환경 확보')], events: [], requests: [],
      scenario: { success: '해당 4건의 수행 가능 여부를 다시 분류합니다.', failure: '해당 항목은 별도 대응이 필요한 제약으로 남습니다.' },
      evidence: []
    },
    {
      key: 'QA', title: '수행 가능 TC 재분류', group: 'QA', area: 'QA', priority: 7, status: 'pending',
      owner: 'QA / 개발팀', checkDate: '', summary: '주요 Blocker 해소 결과를 반영해 N/T·제한적 수행 항목의 테스트 조건을 다시 분류합니다.',
      gate: 'DCM·VDP·CCW 등 선행 조건 해소 결과 반영 → 수행 가능 TC 재분류',
      impact: { count: 854, unit: 'TC', text: '전체 854건 재분류 대상' },
      constraint: null, steps: [], dependsOn: ['DCM', 'VDP'],
      actions: [ac('GS N/T 집계 차이 6건 확인'), ac('Blocker 해소 결과 반영해 재분류')], events: [],
      requests: [rq('QA', 'GS N/T 사유별 합계 78건과 집계 84건의 차이 6건 확인 (중복 2건 표기 포함)')],
      scenario: { success: '해소된 선행 조건 기준으로 수행 가능 범위를 확정합니다.', failure: '현재 분류가 유지되어 1차 DVT와 유사한 N/T가 반복될 수 있습니다.' },
      evidence: ['기능 자체의 결함 여부와 테스트 환경 및 선행 조건 미충족에 따른 제약 사항을 구분하여 관리할 필요가 있습니다.']
    }];
  return normalizeDoc({
    schema: 2, title: '27CY SU#2 · 2차 DVT 진입 점검', subtitle: 'GS · e-Care · DMS 선행 조건과 테스트 수행 가능 범위', asOf: '2026-10-20', example: true,
    issues: issues.map(i => ({ ...i, notes: [], updatedAt: T0 })),
    metrics: [
      { label: 'Global South', total: 326, blocked: 84, limited: 0, other: 242 },
      { label: 'e-Care CCW', total: 236, blocked: 236, limited: 0, other: 0 },
      { label: 'e-Care OPW', total: 292, blocked: 23, limited: 142, other: 127 }],
    reasons: { title: 'GS N/T 사유', rows: [
      { label: 'ADF 선행 작업 필요', count: 50, action: 'DCM ADF 정상 수행', key: 'DCM' },
      { label: 'HU 환경 구성 필요', count: 22, action: 'HU 테스트 환경 구성', key: 'HU' },
      { label: 'DCM 장비 부족', count: 3, action: '추가 DCM 테스트 환경 확보', key: 'ENV' },
      { label: 'DK 서버 연동 미구현', count: 2, action: '서버 기능 구현 및 연동 환경 확보', key: 'DK' },
      { label: 'App 설치 방식 제약', count: 1, action: '링크 기반 App 설치 환경 확보', key: 'ENV' }], reported: 84, note: '중복 2건 표기 포함 · 사유별 집계 기준 QA 확인 필요' },
    notes: ['GS N/T 84건 ↔ 사유별 합계 78건 · 차이 6건 (중복 2건 표기) 확인 필요', '10/14·10/16 협의일은 협의 이력 기준 날짜로, 정확한 일자 최종 확인이 필요합니다.'],
    conclusion: {
      points: [
        { title: 'Global South DCM ADF 정상 수행 여부', body: '대체 DCM에서 ADF가 정상 수행되면 1차 DVT에서 Block된 DCM 연계 N/T·Fail 대부분을 재검증할 수 있습니다. 2대 모두 실패하면 GS 결과는 1차와 큰 차이가 없을 것으로 예상됩니다.' },
        { title: 'e-Care VDP API 인증 문제', body: '9/30부터 협의했지만 접속 대상 안내 변경과 인증 방식 확인 지연으로 10/20 현재 실제 API 연동 검증이 끝나지 않았습니다. 네트워크는 정상이고 인증 오류로 E2E가 제한됩니다.' },
        { title: 'CCW 및 기타 테스트 환경 확보', body: 'CCW 236건은 전량 수행 불가이고 HU·DK도 별도 선행 조건이 있습니다. DCM·VDP가 해결돼도 개별로 해소해야 합니다.' }],
      summary: '선행 조건이 해결된 항목 중심으로 2차 DVT를 진행하고, 수행 불가 항목은 기능 결함과 환경·선행 조건 제약을 구분해 관리합니다.' },
    source: (document.getElementById('sample-text') || {}).textContent || ''
  });
}
