# Mapstone

정적 HTML 일정 보드 프로토타입.

## 열 파일

- `개발 일정 및 진행 현황.dc.html` — **소스 (수정 우선)**
- `share/schedule-maker.html` — 공유용
- `index.html` — 번들 산출물

```bash
python3 -m http.server 8080
```

## v9 추가 기능

- 블록 핸들 축소·반투명
- 속성 **기간 숨김**
- **전체보기** (Esc 종료)
- 표시 5개월 미만 시 마그네틱 1/8개월
- **기간에 맞추기** 확대 (짧은 프로젝트도 화면 가득)
- JS/JSON · 이미지 임포트
- 접속 코드 + Supabase 협업 (`schema.sql`)
- `window.Mapstone.get/set/importJS`

## Supabase

1. `schema.sql` 실행
2. 보드 설정 탭에 URL / anon key / 접속 코드 입력 후 연결
3. 같은 코드로 다른 기기에서 접속

RLS는 프로토타용으로 열려 둘 수 있습니다. 운영 전에 정책을 졸이세요.
