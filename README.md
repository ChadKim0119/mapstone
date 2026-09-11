# Mapstone

정적 HTML 프로토타입. 작업 바 / 구간 / 마일스톤 / 리스크 / 메모를 올리고 PNG·PPT·텍스트로 내보낼 수 있는 일정 보드입니다.

프레임워크나 백엔도 없습니다. 브라우저에서 HTML을 열면 됩니다.

## 어디를 열까

| 파일 | 용도 |
|---|---|
| [`개발 일정 및 진행 현황.dc.html`](개발%20일정%20및%20진행%20현황.dc.html) | 한글 일정 보드. **수정할 때 우선 여기** |
| [`Detailed Implementation Schedule.dc.html`](Detailed%20Implementation%20Schedule.dc.html) | 영문 일정 보드 |
| [`share-timeline.dc.html`](share-timeline.dc.html) | 타임라인 공유용 |
| [`share/schedule-maker.html`](share/schedule-maker.html) | 공유용 Schedule Maker. 첫 실행 시 unpkg CDN 필요 |
| [`index.html`](index.html) | 자산을 넣은 번들 산출물(~3.3MB). 소스가 아님 |

런타임은 [`support.js`](support.js) (`dc-runtime` 생성물) 입니다. 디자인 토큰은 `_ds/` 입니다.

## 로컬에서 실행

```bash
# 가장 안전: 로컬 정적 서버
python3 -m http.server 8080
# 그다음 브라우저에서
# http://localhost:8080/개발%20일정%20및%20진행%20현황.dc.html
```

`file://`로 직접 열어도 되는 페이지가 있지만, 공유용 Maker는 CDN 때문에 서버로 뜻는 것이 더 안전합니다.

## 편집 시 주의

- 기능 수정은 `.dc.html`에 하고, `index.html` 번들은 필요할 때만 다시 만듭니다.
- `support.js`는 생성물입니다. 여기를 곡직 고치면 다음 빌드에서 덮얼 수 있습니다.
- `share/` 아래 `_ds`와 `support.js`는 루트 복제본입니다. 토큰 변경 시 둘 다 맞춰야 합니다.

## 이 repo에 의도적으로 남겨 둔 것

이 PR에서는 앱 로직을 바꾸지 않았습니다.

- `README.md`, `.gitignore` 추가
- 루트 `.DS_Store` 제거
- `index.html`, `uploads/`, 스크린샷, 디자인 시스템은 그대로 둡니다. 지우는 사본이거나 필요할 수 있습니다.
