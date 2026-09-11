# JS / JSON 임포트

PRD를 LLM에 넘길 때 예시 프롬프트:

```
아래 JSON만 출력해. 타임라인 개월 단위.
s/
e 는 시작월로부터의 개월 오프셋.
kind: chev | plain | band | marker | flag | sticky
```

```json
{
  "title": "프로젝트",
  "cfg": { "startY": 2026, "startM": 1, "months": 4, "magnet": true },
  "rows": [{ "id": "app", "name": "앱" }],
  "items": [
    { "kind": "chev", "row": "app", "lane": 0, "s": 0, "e": 1.25, "label": "설계", "color": "#5b3fd1" }
  ]
}
```

다른 앱/
LLM:

```js
const data = window.Mapstone.get();
window.Mapstone.set(data);
window.Mapstone.importJS(jsonString);
```
