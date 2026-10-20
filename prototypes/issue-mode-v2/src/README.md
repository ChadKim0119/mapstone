# 이슈관리 모드 결합 프로토타입 (v2)

MapStone 본 앱(마일스톤 모드)과 분리된 단독 프로토타입입니다. 본 앱 코드·리비전은 바꾸지 않았습니다.

- 실행: 저장소 루트에서 `npm start` → http://127.0.0.1:4173/prototypes/issue-mode-v2/
- 빌드: `python3 prototypes/issue-mode-v2/src/build.py` → `prototypes/issue-mode-v2/index.html` 생성(직접 수정 금지)
- 원본: `style.css`(토큰·레이아웃), `model.js`(정규화·규칙 기반 파서·Claude 프롬프트), `data.js`(27CY 예제), `app.js`(화면)
- 검증: `python3 -m http.server 4190` 을 index.html이 있는 폴더 기준으로 띄우고 `local.html` 경로를 맞춘 뒤 `qa-flow.cjs`(조작 68개), `qa-layout.cjs`(6개 폭 정렬·잘림·겹침) 실행
- 저장: 브라우저 localStorage `mapstone.issueTracker.v2` + JSON 파일 저장/열기
- Claude 분석은 claude.ai 아티팩트에서만 동작하고, 로컬에서는 규칙 기반 정리를 씁니다.
