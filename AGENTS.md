# Mapstone 작업 규칙

- 기능 추가·수정 시 기존 `src/timeline.dc.html`의 `RELEASES` 형식을 참고해 새 리비전을 최상단에 기록합니다. 버전, 작업 에이전트, 변경 제목, 실제 반영한 작업 목록을 포함합니다.
- 기능 변경 요청마다 다음 리비전 번호를 사용하고, 같은 요청의 수정·검증은 해당 리비전 기록에 합칩니다. 기존 리비전 기록은 보존합니다.
- `APP_VER`, 최신 `RELEASES` 버전, `package.json` 버전을 함께 갱신합니다. 예: `v9.55`와 `9.55.0`.
- 편집 원본은 `src/timeline.dc.html`이며 배포본은 `npm run build`로 재생성합니다.
- 작업 후 `npm test`를 실행하고, 화면 확인은 루트 `index.html`을 사용합니다.
