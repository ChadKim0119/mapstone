# 제품 적용 · v9.86

2026-10-09 · Codex

Figma의 Editor selected(5:858), component showcase(3:252), AI Loading(34:918), ItemConnection(58:258) 및 AI 모션 트랙을 현재 제품 v9.85와 비교했습니다. 디자인 문서와 시안의 버전은 제품 리비전과 별개입니다.

## 적용과 대응

- `assets/design-system/tokens.css`: B 파스텔 블루/네이비 토큰. 기존 neutral 토큰과 연결하며 사용자 데이터의 색상은 변환하지 않습니다.
- `assets/design-system/product.css`: 실제 제품 버튼·입력·탭·모달·파일·버전·툴팁·발표 도구·선택 상태의 공통 스타일. 문서의 로컬 브랜드 SVG, 빈 선택 SVG, Pretendard Variable를 재사용하고 빌드 시 함께 번들링합니다.
- `src/timeline.dc.html`: 토큰 연결, 파란 선택 상태, 신규 항목용 디자인 팔레트, v9.86 리비전. 기존 일정/참고/공통구간의 기하와 핸들·닷·연결선 위치 및 사용자 색상 보존.
- `mapstone-ui.js`: 공통 모달 색상과 AI 로딩 시각 요소. 기존 유려한 형상에 자료/스캔/정보 노드를 결합하고 3.2초 트랙을 적용합니다. 붙여넣기 오버레이, 파일 분석 카드, 버전 AI 분석은 기존 공통 경로를 유지합니다. OS 모션 감소 및 설정의 애니메이션 off를 지원합니다.

## 시안에서 의도적으로 조정한 부분

시안의 정적 예제 데이터, 분석 이미지 및 단순한 속성 필드를 제품 데이터나 기능으로 교체하지 않았습니다. 현재 제품의 텍스트 도구·날짜·레인·채우기·비교·발표 도구를 유지합니다. 340px 패널과 기존 700px 모바일 하단 패널 전환을 유지하고, 시간축 172px 세션 열·행 높이·확대값 등 데이터 위치에 영향을 주는 치수는 유지합니다. 기존 저장된 항목의 색상과 날짜는 그대로이며 새 항목과 팔레트만 디자인 색상을 사용합니다.

## 검증

- 루트 index.html / localhost v9.86에서 일정 속성, 선택 핸들, 설정, 버전, AI 입력 모달, 실제 텍스트 파일 분석 로딩, 전체보기/ESC, 390px 모바일 하단 패널 확인.
- 분석 로딩의 자료/스캔/노드 트랙 3.2초 확인. 검증용 파일만 분석했고 결과는 기존 일정에 적용하지 않았습니다.
- 기존 버튼 중 표시된 SVG의 세로 중심 오차 0px 확인(숨겨진 아이콘 제외).
- npm run build, npm test 163개 통과. 커밋·push·배포는 수행하지 않았습니다.

## v9.87 GUI foundation completion

- Unified static template styles, dynamic control states and injected modal styles with semantic foundation tokens. Product-only components (external labels, text selection/editing, format buttons, toolbar grouping chips, comparison reports and image controls, sharing, toast, read-only banners and boot screen) now follow the same foundation.
- Removed the side panel X; the three tabs share the available width. The toolbar panel toggle remains available, including its icon when its label is folded by the existing responsive toolbar rules.
- The badge, favicon and initial loader share `mapstone-icon-flat.svg`. NOW dates inherit the badge foreground with no separate background. The empty state group is centred in the available panel body.
- Sharing cards use blue selection; action and shortcut copy have separate grid cells. Below the existing 700 CSS pixel breakpoint, the main action uses full width. User schedule fills, geometry, connections and motion behaviour remain intact.
- Local visual checks: selected/unselected properties, bold active state, NOW, settings, version/disabled comparison, analysis dialog, desktop/mobile sharing, and responsive bottom panel. No share link was created and no schedule data was replaced. Existing comparison interaction tests cover the semantic colour changes; two saved cloud versions were not available for a live comparison session.
- Build succeeded and all 163 tests passed. Existing tests were updated for the new shared brand asset and semantic comparison colours. Git push/deployment are outside this local implementation.

## v9.88 컬러 적용 재점검

- 별도 템플릿으로 렌더링되던 전체 지우기·행 삭제·날짜 범위·내보내기·리비전·조작 안내 팝업에도 공통 모달, 스크림, 버튼 토큰을 적용했습니다.
- 글자 크기 버튼은 작은 A(10px)/큰 A(17px)로 바꾸고 접근성 명칭과 기존 조절 동작을 유지했습니다. 표시 기간 소제목을 삭제하고 클라우드 파일/보관함 명칭을 적용했습니다.
- 좌측 여백과 포커스 행의 기본 배경을 캔버스 토큰에 맞췄습니다. 사용자 지정 항목과 행 색상은 보존합니다.
- 공유 비밀번호 두 영역의 배경을 제거하고 링크 만들기를 오른쪽에 배치했습니다. 기존 700 CSS px 분기에서는 안내 아래 오른쪽에 버튼을 배치합니다.
- localhost 루트 index.html에서 전체 지우기 확인창(취소), 공유, 클라우드 파일, 설정, 텍스트 도구, 리비전 팝업을 확인했습니다. 기존 3개 일정은 유지했고 데이터 삭제나 공유 링크 생성은 실행하지 않았습니다.
- APP_VER/RELEASES/package를 v9.88/9.88.0으로 갱신했습니다. npm run build 성공, npm test 163개 통과, git diff --check 통과. 커밋·push·배포는 수행하지 않았습니다.

## v9.89 헤더·세션과 공유 크기 안정화

- 헤더의 overflow:hidden이 내부 세션 열의 sticky 기준을 바꾸던 문제를 제거했습니다. 둥근 모서리는 각 끝 셀에 적용하고 가로 스크롤 시 헤더 세션 열과 행 세션 열이 같은 위치에 고정됩니다.
- 세션 열은 최대 5,000개 항목의 메모 레이어보다 위에, 헤더는 세션 열보다 위에 배치합니다. 포스트잇의 기존 최상위 계위는 유지합니다.
- 공유 상단 안내 문단을 삭제하고 열람 비밀번호 문구에서 ‘켜면’을 제거했습니다. 숨겨진 옵션과 입력칸은 visibility:hidden으로 공간을 보존하며 탭 이동과 접근성 트리에서는 제외됩니다. 오류 안내에도 한 줄 공간을 확보합니다.
- localhost에서 가로 스크롤 후 헤더/행 왼쪽 좌표가 모두 0인 것을 확인했습니다. 공유 팝업의 옵션 선택·해제 및 권한 전환 전후 크기는 780×673.125 CSS px, 상단 위치는 90.104 CSS px로 동일했습니다. 열기 애니메이션 종료 후 측정했습니다.
- 작은 화면에서는 기존 반응형 권한 카드와 내부 스크롤을 유지합니다. 임시 화면 크기를 원복했고, 기존 일정 3개는 그대로이며 공유 링크는 생성하지 않았습니다.
- v9.89/9.89.0 동기화, npm run build 성공, npm test 163개 통과.
