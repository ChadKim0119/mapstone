# Mapstone 작업 규칙

> Codex와 Claude Code가 번갈아 작업합니다. 이 파일이 두 에이전트 공통 규칙의 단일 원본이며, `CLAUDE.md`는 이 파일을 불러옵니다. 규칙 변경은 여기에만 합니다.

## 교대 작업 프로토콜

**시작할 때**
1. `git pull --ff-only`로 최신 상태를 받습니다. 충돌·미커밋 변경이 있으면 작업 전에 사용자에게 알립니다.
2. `HANDOFF.md`를 읽고 직전 에이전트의 진행 중 작업, 다음 할 일, 주의 사항을 이어받습니다.
3. `npm test`로 시작 상태가 통과하는지 확인합니다. 실패하면 원인을 먼저 보고합니다.

**끝낼 때**
1. `npm run build` → `npm test` 통과를 확인합니다.
2. `HANDOFF.md`의 **현재 상태**를 덮어쓰고, **작업 로그** 최상단에 한 줄을 추가합니다.
3. 커밋·푸시는 사용자가 요청할 때만 합니다. 커밋 메시지는 기존 관례대로 리비전 번호로 시작합니다. 예: `941 날짜 스냅 개선`.

**충돌 방지**
- 한 번에 한 에이전트만 `main`에서 작업합니다. 동시에 작업해야 하면 브랜치(`codex/...`, `claude/...`)를 씁니다.
- 생성 파일(아래 목록)은 직접 고치지 않습니다. 충돌이 나면 원본만 병합하고 `npm run build`로 다시 만듭니다.
- 다른 에이전트가 남긴 코드를 이유 없이 재작성하지 않습니다. 의도가 불분명하면 `HANDOFF.md`에 질문으로 남깁니다.

## 리비전 기록

- 기능 추가·수정 시 기존 `src/timeline.dc.html`의 `RELEASES` 형식을 참고해 새 리비전을 최상단에 기록합니다. 버전, 작업 에이전트(`Codex` 또는 `Claude Code`), 변경 제목, 실제 반영한 작업 목록을 포함합니다.
- 기능 변경 요청마다 다음 리비전 번호를 사용하고, 같은 요청의 수정·검증은 해당 리비전 기록에 합칩니다. 기존 리비전 기록은 보존합니다.
- 교대 직후 같은 요청을 이어받아 마무리하면 새 번호를 쓰지 않고 기존 리비전에 합칩니다. 이때 `agent`는 처음 작업한 에이전트를 유지합니다.
- `APP_VER`, 최신 `RELEASES` 버전, `package.json` 버전을 함께 갱신합니다. 예: `v0.9.40`과 `0.9.40`.
- 문서·작업 환경만 바꾸는 작업은 리비전을 올리지 않습니다.

## 소스와 빌드

- 편집 원본: `src/timeline.dc.html`, `mapstone-core.js`, `mapstone-ui.js`, `mapstone-help.js`, `support.js`, `vendor/`, `assets/`, `supabase/functions/`(단, 아래 복사본 제외).
- 생성 파일(직접 수정 금지, `npm run build`로 재생성): `index.html`, `share-timeline.dc.html`, `개발 일정 및 진행 현황.dc.html`, `share/` 전체, `supabase/functions/mapstone-api/mapstone-core.js`.
- `versions/`는 과거 스냅샷이므로 수정하지 않습니다.
- Vercel 배포는 `vercel.json`이 `npm run build` 후 `index.html`·`share/`·`assets/`·`*.dc.html`만 `public/`으로 복사해 올립니다. `public/`은 생성 폴더이며 커밋하지 않습니다. 런타임에 새 파일이 필요하면 `vercel.json`의 복사 목록에 추가합니다.
- 작업 후 `npm test`를 실행하고, 화면 확인은 루트 `index.html`을 사용합니다(`npm start` → http://127.0.0.1:4173).

## 비밀 정보

- `.env*`, `.mapstone-admin-key`, `.mapstone-connection`은 커밋하지 않습니다. API 키는 Supabase Edge Function Secrets에만 둡니다.
