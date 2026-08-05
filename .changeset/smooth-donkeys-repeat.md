---
"@seed-design/mcp": minor
---

`export_node_as_image`가 Figma 앱과 웹소켓 서버 없이 REST 모드에서도 작동하도록 업데이트합니다.

- `format` 파라미터에서 주요 LLM 도구가 이미지로 판단하지 않는 `PDF`를 제거합니다.
- `format` 파라미터에서 `SVG`를 제거합니다.
- `scale` 파라미터의 스키마를 Figma REST API 제약에 맞춰 0.01 이상 4 이하로 제한합니다.
