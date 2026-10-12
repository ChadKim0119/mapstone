# 인수인계 (HANDOFF)

> 작업을 끝낸 에이전트가 **현재 상태**를 덮어쓰고 **작업 로그** 맨 위에 한 줄을 추가합니다. 다음 에이전트는 작업 전에 이 파일부터 읽습니다.

## 현재 상태

- **마지막 작업**: Claude Code · 2026-10-12
- **버전**: v0.9.42 (`package.json` 0.9.42)
- **브랜치**: `claude/design-system-extraction-rms069` (v0.9.42 푸시, main 미머지 · 운영 미배포)
- **테스트**: `npm test` 305/305 통과
- **진행 중**: 없음
- **다음 할 일**: v0.9.42 사용자 검토 후 main 머지·운영 배포(https://mapstone-app.vercel.app). Vercel Git 자동 배포가 안 걸리면 mapstone-app 프로젝트에 main 기준 수동 배포.
- **디자인 시스템**: MapStone 디자인 시스템(한국어판) 아티팩트 https://claude.ai/artifact/JAnQNBvL7UzeNgx44bPEeb — 토큰은 `assets/design-system/tokens.css`와 같은 이름. 컴포넌트 57개 카드. 실행 중인 화면이 기준이며, 인벤토리와 다르면 화면을 따름.
- **주의 사항**:
  - v0.9.41에서 패널 컨트롤을 32px·12px로, 4px 버튼을 12px로 통일했습니다. 새 버튼에 4px/6px 모서리를 쓰지 마세요(`var(--ms-radius-control)`).
  - `mapstone-ui.js`의 주입 스타일 문자열은 작은따옴표 JS 문자열입니다. CSS 안에 `'`를 쓰면 문법 오류가 나므로 `%27`·`\u0022`로 이스케이프하세요.
  - 대화상자 닫기는 아직 ‘닫기’ 글자 버튼입니다(디자인 시스템은 X 아이콘). 사용자가 이번에 정합을 보류했습니다.
  - ContextMenu는 디자인 시스템에 ‘제품 미구현·예정’으로만 있습니다.
  - Vercel 프로젝트(vibe-code-class/mapstone)는 결과물을 `public/`에서 찾아 main 포함 모든 배포가 실패하고 있었습니다. `vercel.json`으로 `public/`을 만들도록 수정했습니다(PR #3).
  - 버전 비교 기준은 선택 순서가 아니라 `versions` 배열 순서(이전=기준)로 정합니다(`versionAge`). 비교 화면의 바꾸기는 `visual.setBaseline`을 씁니다.
  - 비교 화면 대화상자는 배경 흐림을 쓰지 않습니다(`.ms-version-workspace::backdrop`). 흐림을 되살리면 핸들 프레임이 3배 느려집니다.
  - 원격에 미병합 브랜치 `chore/repo-hygiene`(PR #1), `feat/v9-board-tools`(PR #2)가 있습니다. 관련 작업 시 먼저 확인하세요.
  - `supabase/.temp/`가 Git에 포함되어 있습니다(Supabase CLI 캐시).

## 미해결 질문

- (없음)

## 작업 로그

<!-- 최신이 위. 형식: - YYYY-MM-DD · 에이전트 · 버전 · 한 줄 요약 -->
- 2026-10-12 · Claude Code · v0.9.42 · 버전 비교: 이전 버전 자동 기준 + 상단 기준 바꾸기, 핸들 60fps(배경 흐림 제거·rAF), 변경 반영 PNG에 변경 표시·범례·내역
- 2026-10-12 · Claude Code · v0.9.41 · Vercel 배포 실패(STATIC_BUILD_NO_OUT_DIR) 수정: vercel.json으로 public/ 생성
- 2026-10-12 · Claude Code · v0.9.41 · 디자인 시스템 아티팩트 작성(한국어) 및 깊은 화면 적용: 패널 32/12, 4px 버튼 정리, 내보내기 메뉴 아이콘, 분석 아코디언·달력·스테퍼 아이콘, system-ui→Pretendard (후속: 좁은 툴바 c1 모드에서 내보내기 셰브런이 숨던 문제 수정)
- 2026-10-12 · Claude Code · v0.9.40 · 교대 작업 환경 구성(AGENTS.md 공통 규칙, CLAUDE.md, HANDOFF.md), launch.json 경로 수정
