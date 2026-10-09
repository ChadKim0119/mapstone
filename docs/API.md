# Mapstone 외부 연동 API

엔드포인트:

```text
https://mffysunppwqscbljooda.supabase.co/functions/v1/mapstone-api
```

편집용 API는 모든 요청에 `X-Mapstone-Code` 헤더를 사용합니다. 접속 코드는 URL, 로그, JavaScript 소스에 넣지 마세요.

## 이미지 · 텍스트 일정 분석

`POST /analyze`에 (선택) `X-Mapstone-Code` 헤더와 `{"image":"data:image/png;base64,..."}` 또는 `{"text":"..."}` 본문을 전송합니다. 이미지는 2MB 이하 PNG/JPEG/WebP data URL, 텍스트는 200,000자 이하입니다. 성공하면 브라우저와 동일한 데이터 계약의 `{"document":{...}}`를 반환합니다. 결과에는 구분 행, 블록(`chev`/`plain`), 공통 구간(`band`), 마일스톤(`marker`), 행 마일스톤·이슈(`flag`), 메모(`sticky`)와 색상·레인·메모가 포함됩니다. 이전 경로 `POST /analyze-image`도 같은 동작을 합니다.

## 보기 링크 생성

`POST /share`에 `{"password":"<6자 이상의 보기 암호>","permission":"view","document":{...}}`를 전송하면 `id`, 편집용 `code`, `permission`을 반환합니다. 현재 일정의 독립적인 사본을 저장합니다.

내보내기 화면은 무작위 보기 암호를 생성하고 `?share=<id>#viewKey=<보기 암호>` 링크를 제공합니다. 링크를 가진 사람이 `GET /share/<id>`에 `X-Mapstone-Password` 헤더로 접속하면 보기 전용 문서를 받습니다. 보기 권한의 수정 요청은 거부됩니다. 편집용 코드는 링크에 포함하지 않습니다.

## 일정 읽기

```http
GET /room
X-Mapstone-Code: <편집 코드>
```

응답은 `id`, `revision`, `document`, `updated_at`을 포함합니다. 변경 여부만 확인할 때 `GET /room?after=<revision>`을 사용합니다. 변경이 없으면 `304`입니다.

## 일정 수정

```http
PUT /room
Content-Type: application/json
X-Mapstone-Code: <편집 코드>

{"revision":12,"document":{...}}
```

읽은 revision을 그대로 보냅니다. 다른 사용자가 먼저 저장하면 `409`와 최신 room이 돌아옵니다. 최신 문서를 다시 읽어 필드 단위로 병합한 뒤 새 revision으로 재시도해야 합니다.

## 데이터 계약

```js
const schedule = {
  schemaVersion: 1,
  title: '프로젝트 일정',
  cfg: {
    startY: 2026,
    startM: 9,
    months: 2,
    weekPx: 100,
    weekMode: 'actual',
    laneH: 44,
    magnet: true,
    overlap: 'moveOther'
  },
  rows: [{ id: 'development', name: '개발' }],
  items: [{
    id: 'requirements',
    kind: 'chev',
    row: 'development',
    lane: 0,
    span: 1,
    s: 0,
    e: 0.5,
    label: '요구사항 분석',
    memo: 'PRD 검토',
    color: '#5b3fd1',
    variant: 'solid',
    hideDuration: false
  }],
  notes: [],
  versions: [],
  now: 0
};
```

`s`와 `e`는 시작 월부터의 개월 수입니다. 5개월 미만 프로젝트는 `0.125`개월 단위를 권장합니다. `kind`는 `chev`, `plain`, `band`, `marker`, `flag`, `sticky`, `image` 중 하나입니다.

`flag` 항목의 선택적 `hideDate: true`는 메모의 날짜를 숨깁니다. 날짜 표시 형식은 `MM.DD`이며, 속성 입력에는 전체 날짜를 사용합니다.

페이지 안에서 자동화할 때는 `window.mapstone.getDocument()`, `window.mapstone.replaceDocument(data)`, `window.mapstone.exportJavaScript()`, `window.mapstone.getConnection()`을 사용할 수 있습니다. `replaceDocument`는 서버와 가져오기 화면과 동일한 검증을 수행합니다.

## LLM에 요청하는 예

```text
PRD를 분석해 Mapstone schedule 데이터만 JavaScript 객체로 작성해 줘.
시작 월을 0으로 하고 s/e는 개월 단위로 지정해.
5개월 미만 일정은 0.125 단위로 지정하고, rows의 id와 items의 row를 일치시켜.
모든 블록 id는 고유해야 해. 함수, 계산식, 외부 호출 없이
const schedule = {...}; 형식의 데이터 리터럴만 출력해.
```

가져오기 화면은 JavaScript를 실행하지 않습니다. 함수 호출, 계산식, getter, 중복 키와 잘못된 참조는 거부합니다.

## 버전 이미지 분석 (v0.9.16)

`POST /version-projects/{projectId}/compare`는 같은 작업물의 `ids` 두 개와 선택적으로 `images`(이전/이후 PNG data URL 두 개), `prompt`(현재 작업물 기준 비교 요청문)를 받습니다. 복구 코드 인증과 저장된 버전 데이터로 소유권 및 변경 사실을 확인합니다. 이미지는 개별 4MB 이내, 요청 전체는 9MB 이내입니다.

Gemini 응답에는 `report`, `from`, `to`, `imageCompared`가 포함됩니다. `imageCompared: true`일 때 두 이미지를 Gemini에 전달한 분석입니다. UI는 이전 서버의 텍스트 분석 결과를 이미지 분석으로 표시하지 않습니다.

이 변경은 Edge Function 배포가 필요합니다. Supabase CLI 로그인 후 프로젝트를 확인하고 `supabase functions deploy mapstone-api --project-ref mffysunppwqscbljooda`로 배포합니다. 기존 `GEMINI_API_KEY` 및 `GEMINI_MODEL` 환경 설정을 사용합니다.

분석 멈춤은 브라우저 요청을 취소하고 늦게 도착한 결과를 무시합니다. 서버나 Gemini의 진행 중 연산 중단은 보장하지 않습니다. 예상 진행률은 실제 서버 처리율이 아닙니다.
