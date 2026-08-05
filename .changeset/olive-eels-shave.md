---
"@seed-design/mcp": minor
---

특정 레이어의 SVG 마크업을 받아오는 `export_node_as_svg` 툴을 추가합니다. `export_node_as_image`의 format `SVG` 파라미터를 대체합니다.

- REST 및 WebSocket 모드 모두에서 사용할 수 있습니다.
- `outlineText` 파라미터를 사용하여 텍스트 레이어를 vector path로 변환할지 정합니다. Figma API 기본값은 `true`지만 이 도구의 기본값은 응답 크기 최적화를 위해 `false`입니다.

`figma-api` 의존성을 업데이트합니다.
