# MapStone 컴포넌트 인벤토리 · 1.2.0

실제 웹과 원본 화면을 기준으로 정의한 50개 세트 / 158개 변형. 제품 반영은 별도입니다.

| 컴포넌트 | 용도와 상태 | Figma |
|---|---|---|
| MapStone/Button | 문서·편집 액션. Enter/Space 실행. Focus 2px 외곽선. Loading/Disabled는 실행하지 않음. compact 36px, 터치 44px. 상태: Style=Primary, State=Default, Style=Primary, State=Hover, Style=Primary, State=Pressed, Style=Primary, State=Focus, Style=Primary, State=Disabled, Style=Primary, State=Loading, Style=Secondary, State=Default, Style=Secondary, State=Hover, Style=Secondary, State=Pressed, Style=Secondary, State=Focus, Style=Secondary, State=Disabled, Style=Secondary, State=Loading, Style=Ghost, State=Default, Style=Ghost, State=Hover, Style=Ghost, State=Pressed, Style=Ghost, State=Focus, Style=Ghost, State=Disabled, Style=Ghost, State=Loading | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=3-110) |
| MapStone/IconButton | 이름 있는 아이콘 버튼. aria-label 필수. 기본 36px / 터치 44px. 상태: State=Default, State=Hover, State=Focus, State=Disabled | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=3-158) |
| MapStone/Field | 입력창. 라벨·오류 메시지를 외부 FieldGroup으로 연결. Focus 2px. disabled와 readonly 구분. 상태: State=Default, State=Focus, State=Error, State=Disabled | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=3-175) |
| MapStone/Tab | 패널 탭. tablist/tab/tabpanel. 방향키·Home·End 이동. 상태: State=Default, State=Selected, State=Focus | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=3-183) |
| MapStone/Toggle | 보기 옵션. role=switch, aria-checked, Space 전환. 상태: State=Off, State=On, State=Focus, State=Disabled | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=3-191) |
| MapStone/Badge | 상태를 색상과 텍스트로 동시에 표시. 상태: Kind=Info, Kind=Success, Kind=Warning, Kind=Error, Kind=Compare | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=3-201) |
| MapStone/Schedule | 오른쪽 방향의 일정: 평평한 시작, 화살촉 종료. 둥근 끝점 없음. 선택 테두리는 동일한 실루엣을 따른다. 저장된 사용자 색상은 유지. 상태: Kind=Planning, State=Default, Kind=Planning, State=Selected, Kind=Development, State=Default, Kind=Development, State=Selected, Kind=Quality, State=Default, Kind=Quality, State=Selected | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=3-213) |
| MapStone/Milestone | 마일스톤 링·라벨·날짜. 연결선은 타임라인 레이어에서 배치. 상태: State=Default, State=Selected | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=3-228) |
| MapStone/Issue | 위험 이슈. 링·텍스트·연결선으로 식별, 색상 단독 사용 금지. 상태: State=Default, State=Selected | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=3-235) |
| MapStone/Note | 다중 행 메모. 내용 편집·날짜·연결 기준점 유지. 상태: State=Default, State=Selected | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=3-242) |
| MapStone/Period | 여러 일정을 묶는 기간. 일정 바 뒤쪽에 배치. 상태: State=Default, State=Selected | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=3-249) |
| MapStone/Reference | 참고 항목: 방향 없는 둥근 사각형, 6px 모서리, 밝은 표면과 좌측 정렬 텍스트. 일정·메모와 구분. 상태: State=Default, State=Selected | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=16-125) |
| MapStone/Checkbox | 공유 옵션·복수 선택. Space 전환; mixed는 하위 선택이 일부 적용된 경우. 상태: State=Off, State=On, State=Mixed, State=Focus, State=Disabled | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=22-34) |
| MapStone/Radio | 공유 권한·버전 선택. 방향키 이동, 선택 상태는 테두리와 점으로 표현. 상태: State=Off, State=On, State=Focus, State=Disabled | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=22-79) |
| MapStone/Stepper | 표시 개월 수·레인 높이·행 높이·기간. 양쪽 조작 폭 36px, 숫자 중앙 정렬, 최소·최대에서 해당 버튼 비활성. 상태: State=Default, State=Focus, State=Disabled | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=22-117) |
| MapStone/DateField | 시작 월·항목 시작/종료일. 이전/다음 조절 및 기본 브라우저 캘린더; 실제 날짜 유지. 상태: State=Default, State=Focus, State=Error, State=Disabled | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=22-156) |
| MapStone/TextArea | 라벨·메모·변경 기록·AI 텍스트. 1줄에서 내용에 따라 증가, 최대 5줄 이후 스크롤; AI 입력은 큰 입력창. 상태: State=Default, State=Focus, State=Error, State=Disabled | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=22-193) |
| MapStone/Select | 작업물·행 범위 선택. 우측 16px 꺾쇠, 기본 select 키보드와 옵션 선택 동작 유지. 상태: State=Default, State=Open, State=Focus, State=Disabled | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=22-234) |
| MapStone/SegmentedControl | 月 간격 기준·겹침 처리. 동일 폭 셀, 선택과 focus를 구분. 상태: State=First, State=Second, State=Focus | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=22-282) |
| MapStone/ColorSwatch | 항목·행 배경색. 사용자 색상 보존, 선택 링과 색상 이름 제공; 커스텀 컬러 입력. 상태: State=Default, State=Selected, State=Custom | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=22-315) |
| MapStone/Slider | 화면 배율. 드래그와 방향키 조절, 숫자 표시, 너비 맞춤은 별도 아이콘 버튼. 상태: State=Default, State=Focus, State=Disabled | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=22-345) |
| MapStone/MenuItem | 더보기·내보내기·컨텍스트 메뉴. 왼쪽 액션, 오른쪽 단축키, Enter 실행, Esc 닫기. 상태: State=Default, State=Hover, State=Selected, State=Disabled | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=22-380) |
| MapStone/Accordion | 고급 설정·AI 데이터 예제. 펼침 상태와 aria-expanded 연결, 현재 사용자 입력을 유지. 상태: State=Closed, State=Open | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=22-415) |
| MapStone/Tooltip | hover·focus에서 표시, 설정한 표시 시간 후 닫힘, 본문을 가리지 않는 위치. 상태: State=Default, State=Shortcut | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=22-438) |
| MapStone/Toast | 일시적 상태 알림. role=status; 오류는 원인과 재시도 안내를 함께 유지. 상태: State=Info, State=Success, State=Error | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=22-457) |
| MapStone/InlineMessage | 입력 도움말·검증·네트워크 상태. 색상 외 문장으로 원인/해결책 제공, 입력과 연결. 상태: State=Info, State=Error, State=Success | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=22-480) |
| MapStone/Keycap | 툴팁·사용법·AI 붙여넣기 안내. 텍스트를 고정 이미지로 만들지 않는다. 상태: State=Default, State=Combination | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=22-501) |
| MapStone/Scrollbar | 캔버스 가로/세로 스크롤. 실제 스크롤바 우선; 장식 레이어와 구분. 상태: State=Default, State=Hover | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=22-520) |
| MapStone/SettingRow | 설정창 공통 행. 라벨/설명은 왼쪽, 제어는 오른쪽 정렬. 72px 높이, 16px 간격; 긴 설명은 다음 줄. 상태: State=Toggle, State=Choice | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=25-155) |
| MapStone/SessionHeader | 고정 세션 열. 행 이름 편집, ⠿로 순서 변경, 아래 경계의 +로 추가. 행 삭제는 확인 후, 마지막 행 보호. 상태: State=Default, State=Selected, State=Editing | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=25-184) |
| MapStone/MonthHeader | 연도·월·주 헤더. 세션 열과 그리드 경계 일치, 시간축 순서 유지. 상태: State=Month, State=Week | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=25-212) |
| MapStone/NowMarker | 상단 캔버스와 세로 기준선. 클릭 속성, 드래그 날짜 이동, 더블클릭·Enter로 오늘; 기간 밖이면 확장 확인. 상태: State=Default, State=Selected | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=25-233) |
| MapStone/ResizeHandle | 일정 좌우·위아래, 행 경계의 리사이즈. hover/선택 때만 표시하고 화살표 실루엣과 별도 레이어. 상태: State=Default, State=Hover | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=25-250) |
| MapStone/ConnectionPoint | 메모의 연결점. 일정·참고·공통 구간의 정확한 시점에 연결; 위치 보존. Delete는 연결만 해제. 상태: State=Detached, State=Attached, State=Selected | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=25-269) |
| MapStone/LeaderLine | 메모·외부 라벨 연결선. 1.5px, 둥근 조인, 데이터나 조작을 가리지 않도록 pointer-events:none. 상태: State=Horizontal, State=Elbow | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=25-290) |
| MapStone/DropZone | AI 이미지·텍스트, 파일 불러오기, 비교 입력. 파일 선택/드롭/붙여넣기 동등 지원. 장식 이미지는 사용자 입력과 분리. 상태: State=Empty, State=DragOver, State=Error | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=25-348) |
| MapStone/ImagePreview | 실제 업로드 원본은 contain으로 표시, 크롭/왜곡 금지. 파일명·해상도, 우측 상단 30px 삭제. 처리 중 교체/삭제 비활성. 샘플의 안내 그림은 예제이며 분석 데이터가 아니다. 상태: State=Ready, State=Processing, State=Error | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=25-449) |
| MapStone/AnalysisStatus | AI 분석 상태. 중복 실행 방지, role=status와 aria-busy, 오류 후 원본/텍스트 유지. 성공 후 검토 단계로 이동. 상태: State=Idle, State=Loading, State=Error | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=25-514) |
| MapStone/AnalysisResult | AI 결과는 검토 후 적용. 기존 일정은 JSON 백업, 교체 후 실행 취소. 날짜 추론·겹침·1일 마일스톤 처리 고지. 상태: State=Ready, State=Warning | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=25-554) |
| MapStone/PermissionCard | 공유 권한. radio group, 기본 보기. 선택 테두리와 권한 설명을 함께 제공; 비밀번호는 별도 체크박스와 필드. 상태: State=View, State=Edit | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=25-583) |
| MapStone/VersionCard | 보관 버전의 태그·제목·자동 날짜·메모와 액션. 비교는 현재 작업물의 두 버전을 선택. 불러오기와 삭제는 분리. 상태: State=Default, State=Selected | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=25-606) |
| MapStone/CompareRow | 비교 타임라인·변경 요약. 색상과 기호/텍스트를 같이 사용, 삭제는 점선·취소선. AI 인사이트는 전체 상세를 유지. 상태: State=Added, State=Changed, State=Removed | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=25-632) |
| MapStone/DialogHeader | 모달 상단 고정 헤더. Esc 닫기, focus trap, 시작 버튼으로 focus 복귀. 본문 별도 스크롤. 상태: State=Default, State=CloseFocus | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=25-668) |
| MapStone/ReadOnlyBar | 공유 보기와 편집 전환. 잠금 상태를 명시하고 편집 가능 여부를 서버 권한과 일치시킨다. 상태: State=View, State=Unlock | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=25-693) |
| MapStone/ContextMenu | 캔버스·항목 우클릭. 실행 가능한 액션만 표시, Esc/외부 클릭 닫기, 삭제는 선택 범위 확인. 상태: State=Item, State=Canvas | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=25-718) |
| MapStone/HelpNavigation | 사용법 좌측 섹션 목차. 본문은 원래 스크린샷과 편집 가능한 설명, 키보드 안내를 함께 유지. 상태: State=Default, State=Selected | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=25-741) |
| MapStone/RevisionEntry | 제품 리비전 히스토리. 버전·작업 에이전트·제목·작업 목록 보존; 디자인 문서 버전과 제품 버전 분리. 상태: State=Default, State=Latest | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=25-760) |

| MapStone/ConnectedAnnotation | 이슈·메모의 왼쪽 닷과 둥근 대상 항목을 한 컴포넌트로 결속. 상태 Issue/Note/Selected. | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=58-214) |
| MapStone/ItemConnection | 출발 일정의 닷→둥근 직교 연결선→대상 닷. 연결/메모/선택/분리 상태. | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=58-258) |
| MapStone/ActionBar | 주요 버튼은 우측 끝, 보조 버튼은 그 왼쪽. 단일/쌍 상태. | [편집](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=67-1977) |

## 조합 화면

- [AI 분석 / Empty](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=34-810)
- [AI 분석 / Ready](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=34-873)
- [AI 분석 / Loading](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=34-918)
- [AI 분석 / Error](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=34-964)
- [AI 분석 / Review](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=34-1010)
- [공유 / 권한과 비밀번호](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=34-1064)
- [보관된 작업물 / 선택과 불러오기](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=34-1091)
- [버전 비교 / 변경 인사이트](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=34-1117)
- [맵스톤 파일 / 불러오기](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=34-1148)
- [사용법 / 목차와 조작 안내](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=34-1178)
- [전체 지우기 / 확인](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=34-1219)
- [메뉴 / 더보기와 내보내기](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=34-1240)
- [설정창 / 전체 항목 명세](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=34-1271)

## 캔버스 및 AI 이미지

상단 마일스톤 공간과 타임라인은 하나의 작업 캔버스입니다. 감성 요소는 상단 여백과 비어 있는 우측 패널 가장자리에서만 사용하며 데이터·선·문자를 가리지 않습니다. 원본의 보라색 검수선은 제품 테두리가 아닙니다.

- 빈 패널: 문서/돋보기 벡터와 우측 하단의 부드러운 원. 항목 선택 시 감춥니다.
- AI 분석 소개: 이미지·문서·스캔 영역·작은 반짝임을 결합한 편집 가능한 벡터.
- 분석 입력: 원본 비율을 유지한 FIT 미리보기. 예제는 실제 분석 결과를 의미하지 않습니다.
- 상태: Empty / Ready / Loading / Error / Review. 처리 중 재실행·삭제 비활성, 오류 시 재시도.
- 실제 입력 규칙: PNG/JPEG/WebP. 2MiB·최장4096px 이내는 원본 사용, 초과 이미지는 최장3000px에서 전송 크기에 맞춰 단계적으로 축소.
- 적용 전 현재 문서 백업. 디자인 작업에서는 AI 요청·결과 적용을 실행하지 않았습니다.

## 정렬 계약

- 버튼: 내용 전체 중앙, 빈 라벨은 배치에서 제외. 텍스트 HUG. 기본 줄 높이20px, 툴바18px. 높이36px/툴바32px.
- 아이콘 버튼: 16px 아이콘 중심과 버튼 중심 일치. 화면 버튼140개에서 오차0.1px 이내 확인.
- 설정 행: 좌우12px, 라벨과 설명 사이4px. 텍스트 묶음 HUG 높이와 세로 중앙 정렬로 상하 여백 대칭화.
- 포커스 테두리는 콘텐츠 정렬 크기에 포함하지 않습니다.


## AI 분석 모션 · 1.2.0

[재생 영상](ai-processing-motion.mp4) · [Figma 모션 시안](https://www.figma.com/design/zCKU8rRC44Fnke43JcNdon?node-id=58-274)

3.2초 타임라인: 이미지 스캔 광선이 위에서 아래로 이동하고, 추출된 정보 라인과 의미 노드가 순서대로 강조됩니다. 지속 시간을 임의 진행률로 표시하지 않습니다. 움직임 감소 설정에서는 정적 문서·AI 표식과 분석 중 문구를 제공합니다. Figma 화면의 단순 회전 스피너는 제거했습니다.

## 화면 배치 보완

모달의 주요 버튼은 우측, 보조 버튼은 왼쪽에 둡니다. 생성 도구와 보기 토글이 있는 툴바는 원래 위치를 유지합니다. 비교·보관 화면의 버전 카드는 각 화면의 가용 폭을 사용하고, 우측 패널은340px·내용 양옆16px을 유지합니다.
