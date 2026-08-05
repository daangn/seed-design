---
"@seed-design/mcp": minor
---

레이어를 SVG 마크업으로 받는 `export_node_as_svg` 툴을 추가합니다.

`export_node_as_image`에서 빠진 SVG를 별도 툴로 분리했습니다. SVG를 이미지 응답으로 내려주면 주요 LLM 도구가 렌더하지 못하고 조용히 버리기 때문에, 텍스트로 반환해야 에이전트가 실제로 읽을 수 있습니다. path 데이터나 viewBox 원본이 필요한 벡터 아트워크에 쓰세요. REST 모드와 WebSocket 모드 양쪽에서 동작합니다.

`outlineText`는 텍스트를 vector path로 변환할지 정합니다. Figma 기본값은 `true`지만 이 툴은 `false`를 기본으로 씁니다. 텍스트가 `<text>`로 남아야 응답이 작고 읽을 수 있기 때문입니다. Figma와 픽셀 단위로 같아야 할 때만 `true`로 지정하세요.

WebSocket 모드에서는 Figma 플러그인도 최신 버전이어야 합니다.

REST 모드가 `outlineText`를 제대로 전달하려면 `figma-api` 2.1.4-beta 이상이 필요해 의존성을 올렸습니다. 그 이전 버전은 값이 `false`인 쿼리 파라미터를 요청에서 빠뜨립니다.
