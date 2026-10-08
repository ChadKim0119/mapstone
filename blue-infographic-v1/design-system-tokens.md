# MapStone 디자인 시스템 · Blue Infographic 1.2.0

2026-10-08 · Codex · Connected Car · 디자인 명세 / 제품 미적용

## 방향과 근거

B 방향을 적극 적용하고 파스텔 느낌을 조금 더합니다. 신규 아이콘은 원래 3단 레이어 실루엣을 유지한 플랫 벡터입니다. 화면은 원본 구현물의 위치를 유지합니다. 기능 기준은 현재 제품 v9.71의 src/timeline.dc.html 및 mapstone-ui.js입니다. 레퍼런스 이미지의 v9.83은 제품 버전이 아닙니다.

## 화면과 형태

| 영역 | 배치 및 규칙 |
|---|---|
| 헤더 | 높이52px. 브랜드·버전·문서명·저장 상태·도움말·언어·모드 |
| 툴바 | 높이52px. 왼쪽 추가/보기, 중앙 확대, 오른쪽 AI 분석·불러오기·내보내기·공유·삭제·패널 표시 |
| 캔버스 | 마일스톤 공간과 타임라인을 하나의 작업 공간으로 유지. 세션 열168px |
| 우측 패널 | 폭340px. 속성·설정·버전 탭과 닫기, 내용 여백16px |
| 일정 | 오른쪽 방향성. 좌측8px와 부드러운 꼭짓점. 데이터 기간은 변형하지 않음 |
| 참고 항목 | 방향성 없는 둥근 사각형, 반경6px |
| 설정 | 입력 쌍은 같은 폭, 설정 행 좌우12px·라벨 간격4px, 컨트롤 우측 정렬 |

## 버튼 정렬 계약

- 내용 묶음 전체를 가로·세로 중앙 정렬합니다. 빈 텍스트는 숨겨 간격 계산에서 제외합니다.
- 라벨은 HUG, 줄 높이20px / 툴바18px. 높이36px / 툴바32px. 터치 조작은44px 영역을 확보합니다.
- 아이콘16px. 포커스 테두리는 배치 크기에 포함하지 않습니다.
- 설정의 라벨·설명 묶음은 실제 콘텐츠 높이를 사용합니다.
- 원본18개 변형과 화면 버튼140개를 수정했습니다. 중앙 정렬 오차0.1px 이내, 설정 행8개와 확대 화면 검수를 확인했습니다.

## 토큰 · 93개

| 이름 | 값 / 별칭 | 범위 |
|---|---|---|
| `palette/white` | `#FFFFFF` |  |
| `palette/blue/50` | `#F5F8FD` |  |
| `palette/blue/100` | `#EAF2FC` |  |
| `palette/blue/200` | `#D2E2F7` |  |
| `palette/blue/300` | `#A4C4EF` |  |
| `palette/blue/500` | `#4D7FD8` |  |
| `palette/blue/600` | `#3568C5` |  |
| `palette/blue/700` | `#2959AF` |  |
| `palette/navy/700` | `#315A88` |  |
| `palette/navy/800` | `#234770` |  |
| `palette/navy/900` | `#16365D` |  |
| `palette/cyan/100` | `#DFF7FB` |  |
| `palette/cyan/500` | `#87D0DF` |  |
| `palette/cyan/700` | `#087F95` |  |
| `palette/slate/500` | `#5E7694` |  |
| `palette/slate/600` | `#4E6380` |  |
| `palette/slate/300` | `#B3C2D4` |  |
| `palette/violet/100` | `#EEEAFE` |  |
| `palette/violet/600` | `#6D5CCE` |  |
| `palette/amber/100` | `#FFF0C7` |  |
| `palette/amber/700` | `#805400` |  |
| `palette/red/50` | `#FFF2F3` |  |
| `palette/red/600` | `#C83543` |  |
| `palette/green/50` | `#E9F7EF` |  |
| `palette/green/700` | `#147447` |  |
| `color/surface/canvas` | `→ palette/blue/50` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/surface/default` | `→ palette/white` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/surface/subtle` | `→ palette/blue/100` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/surface/selected` | `→ palette/blue/100` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/text/primary` | `→ palette/navy/900` | TEXT_FILL |
| `color/text/secondary` | `→ palette/slate/600` | TEXT_FILL |
| `color/text/muted` | `→ palette/slate/500` | TEXT_FILL |
| `color/text/inverse` | `→ palette/white` | TEXT_FILL |
| `color/text/disabled` | `→ palette/slate/600` | TEXT_FILL |
| `color/border/default` | `→ palette/blue/200` | STROKE_COLOR |
| `color/border/strong` | `→ palette/blue/300` | STROKE_COLOR |
| `color/action/primary` | `→ palette/blue/600` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/action/hover` | `→ palette/blue/700` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/action/pressed` | `→ palette/navy/800` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/action/disabled` | `→ palette/blue/100` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/focus/ring` | `→ palette/blue/600` | STROKE_COLOR |
| `color/brand/navy` | `→ palette/navy/900` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/brand/blue` | `→ palette/blue/600` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/brand/cyan` | `→ palette/cyan/500` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/status/error` | `→ palette/red/600` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/status/error-bg` | `→ palette/red/50` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/status/success` | `→ palette/green/700` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/status/success-bg` | `→ palette/green/50` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/status/warning` | `→ palette/amber/700` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/status/warning-bg` | `→ palette/amber/100` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/status/info` | `→ palette/blue/700` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/status/info-bg` | `→ palette/blue/100` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/timeline/planning` | `→ palette/violet/600` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/timeline/development` | `→ palette/navy/800` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/timeline/quality` | `→ palette/cyan/700` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/timeline/group` | `→ palette/blue/100` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/timeline/milestone` | `→ palette/blue/600` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/timeline/issue` | `→ palette/red/600` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/timeline/note` | `→ palette/amber/100` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/timeline/note-ink` | `→ palette/navy/900` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/timeline/today` | `→ palette/blue/700` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/timeline/compare` | `→ palette/violet/600` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `color/timeline/grid` | `→ palette/blue/200` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `space/0` | `0` | GAP |
| `space/1` | `4` | GAP |
| `space/2` | `8` | GAP |
| `space/3` | `12` | GAP |
| `space/4` | `16` | GAP |
| `space/5` | `20` | GAP |
| `space/6` | `24` | GAP |
| `space/8` | `32` | GAP |
| `space/10` | `40` | GAP |
| `space/12` | `48` | GAP |
| `radius/control` | `12` | CORNER_RADIUS |
| `radius/card` | `16` | CORNER_RADIUS |
| `radius/panel` | `20` | CORNER_RADIUS |
| `radius/pill` | `9999` | CORNER_RADIUS |
| `size/control-sm` | `32` | WIDTH_HEIGHT |
| `size/control-md` | `36` | WIDTH_HEIGHT |
| `size/touch` | `44` | WIDTH_HEIGHT |
| `size/panel` | `340` | WIDTH_HEIGHT |
| `size/row` | `104` | WIDTH_HEIGHT |
| `size/header` | `52` | WIDTH_HEIGHT |
| `size/toolbar` | `52` | WIDTH_HEIGHT |
| `size/label-column` | `168` | WIDTH_HEIGHT |
| `border/default` | `1` | STROKE_FLOAT |
| `border/focus` | `2` | STROKE_FLOAT |
| `motion/fast` | `120` |  |
| `motion/normal` | `180` |  |
| `motion/panel` | `220` |  |
| `radius/reference` | `6` | CORNER_RADIUS |
| `radius/schedule` | `8` | CORNER_RADIUS |
| `opacity/ambient` | `0.23999999463558197` | OPACITY |

정확한 별칭·CSS 이름·Figma ID는 tokens.json, CSS 선언은 tokens.css에 있습니다. Primitives25 / Semantic38 / Metrics30입니다.

## 타이포그래피

Pretendard. 버튼의 상하 여백은 글리프의 픽셀 끝이 아닌 명시한 줄 상자의 중심으로 정렬합니다.

| 스타일 | 크기 | 줄 높이 | 굵기 |
|---|---:|---:|---:|
| Caption | 12px | 18px | 500 |
| Body | 14px | 22px | 400 |
| Label | 14px | 20px | 600 |
| Section | 16px | 24px | 700 |
| Title | 24px | 32px | 700 |
| Display | 40px | 52px | 700 |

## 캔버스와 이미지

감성 요소는 상단의 빈 여백과 비어 있는 패널 가장자리에서만 사용합니다. 데이터·문자·연결선을 가리지 않으며 opacity0.24 이하로 제한합니다. 보라색 검수선은 제품 테두리가 아닙니다.

- 빈 패널: 편집 가능한 문서·돋보기와 하단의 부드러운 원. 항목 선택 후 감춥니다.
- AI 소개: 편집 가능한 이미지·문서·스캔·반짝임 벡터.
- AI 입력: 원본 비율 FIT, 자르기 없이 내용 표시. 실제 사용자 입력과 장식 에셋을 구분합니다.
- AI 상태: Empty / Ready / Loading / Error / Review. 처리 중 삭제·재실행을 비활성화합니다. 결과는 검토 후 적용합니다.
- 입력 예제는 실제 분석 결과가 아닙니다. 이 디자인 작업에서 API 요청·문서 적용을 실행하지 않았습니다.

## 컴포넌트와 화면

50개 세트·158개 변형 및 화면 조합은 [컴포넌트 인벤토리](component-inventory.md)에 정의했습니다. 공유 권한·비밀번호, 버전 선택/비교, 파일 불러오기, 도움말, 전체 삭제 확인, 메뉴와 전체 설정 화면을 포함합니다. 전체 기능의 서버 동작이나 프로토타입 연결을 검증했다는 의미는 아닙니다.

[Figma](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=5-858) · [전체 설정](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=34-1271)

## 검증

tokens.json / tokens.css / Figma 인계 데이터의 토큰·별칭 일치를 검증했습니다. 본문과 주요 단색 배경의 대비 검사 결과는 validation.json에 있습니다. 모든 그라데이션 위치의 대비를 검증했다는 의미는 아닙니다. UI·장식은 편집 가능한 벡터이며 AI 입력 예제4개 상태만 래스터를 사용합니다. 제품 코드와 배포에는 반영하지 않았습니다.


## 2026-10-09 전체 정렬 재검수

컴포넌트200개, 컨트롤·작업 패턴404개, 화면 컨테이너588개의 회전·크기·테두리를 반영한 실제 경계 검사를 수행했습니다. 중앙 정렬과 잘림 오류0건입니다. 화면20개에서 인스턴스457개 모두 원본 연결, 잘못된 글꼴0건입니다. 이것은 정렬·경계에 대한 검사이며 전체 기능 동작 보증은 아닙니다.

체크박스는18px 박스 안의9×7px 체크를 x4.5/y5.5에 배치하고 혼합 표시도 중앙에 맞췄습니다. 여러 줄 입력은 상단12px에 맞췄고, 포커스 테두리가 내용을 밀지 않도록 했습니다. 모달 닫기·주요 액션·버전 카드의 실제 폭을 확인해 정렬했습니다.
