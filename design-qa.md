# Design QA — v9.18 toolbar

- Source: `/var/folders/x8/48ybgzn102z5t2zgwv8n_gk40000gn/T/codex-clipboard-e25c374a-3e61-44b7-843a-26d4edf46755.png`
- Implementation: `http://127.0.0.1:4173/index.html` (Codex in-app Browser capture, 2026-10-04)
- Final result: **passed**

| Category | Result | Evidence |
| --- | --- | --- |
| Toolbar order and grouping | Passed | Element actions occupy row 1; interaction, viewport, and file actions are chunked across row 2 in the annotated order. |
| Labels | Passed | `요소 추가`, `마우스 조작`, `불러오기`, and `포스트잇` match the requested naming. |
| Active/inactive states | Passed | Active snap/settings buttons render `rgb(24, 26, 27)` with white text; inactive mouse/settings buttons render white with dark text. |
| Menu dismissal | Passed | Opening another menu keeps one menu open; clicking the title outside the menu reduces the open-menu count from 1 to 0. |
| Month header | Passed | Month labels remain; the repeated `4w` line is absent. |
| Runtime | Passed | No browser warnings or errors during interaction checks. |

## Residual differences

- Responsive wrapping remains viewport-dependent so controls stay usable on narrower screens.
- Button copy follows the annotated Korean labels while preserving the existing English/Japanese locale behavior.
