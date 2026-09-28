# Mapstone

## v9.1 이미지 일정 분석

가져오기 창에서 PNG, JPEG, WebP 일정표를 선택한 뒤 **편집 가능한 일정으로 분석**을 누르면 행, 작업명, 시작·종료 시점을 읽어 Mapstone 블록으로 변환합니다. 분석 호출은 Supabase Edge Function에서 처리하며 공동 편집 접속 코드가 필요합니다. **참조 이미지로 추가**를 누르면 기존 방식대로 이동·크기 조절 가능한 이미지가 추가됩니다.

운영 환경의 Supabase Edge Function Secrets에 `OPENAI_API_KEY`를 설정해야 합니다. 모델은 `OPENAI_VISION_MODEL`로 바꿀 수 있으며 기본값은 `gpt-4.1-mini`입니다.

브라우저에서 개발 일정을 편집하고 PNG, PPTX, PDF, 텍스트로 내보내는 일정 보드입니다. `index.html`은 외부 CDN 없이 실행되는 단일 파일 배포본입니다.

## 사용

- `index.html`을 열거나 정적 웹 서버에 배포합니다.
- 로컬 일정은 브라우저에 자동 저장됩니다.
- **접속 코드 · DB**에서 같은 편집 코드를 입력한 사용자는 동일한 일정을 편집합니다.
- **가져오기**에서 PNG/JPEG/WebP 참조 이미지를 추가하거나 LLM이 만든 JavaScript/JSON 일정 데이터를 검토한 뒤 적용합니다.
- **전체보기**는 도구와 속성 패널을 숨기고 일정만 화면에 맞춥니다. `F` 또는 `Esc`로 돌아옵니다.

## 개발

편집 원본은 `src/timeline.dc.html`입니다. 다음 명령은 단일 파일과 공유용 HTML을 같은 원본에서 다시 만듭니다.

```bash
npm run build
npm test
```

Supabase DB와 함수 소스는 `supabase/`에 있습니다. 브라우저는 테이블에 직접 접근하지 않으며 Edge Function을 통해서만 읽고 씁니다. 배포된 함수 주소와 데이터 계약은 [docs/API.md](docs/API.md)를 참고하세요.

관리자 키는 `.mapstone-admin-key`에 로컬로 생성되며 Git에서 제외됩니다. 키를 잃으면 DB의 `mapstone_admin.key_hash`를 새 키의 SHA-256 값으로 교체해야 합니다.
