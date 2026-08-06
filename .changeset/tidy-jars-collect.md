---
"@seed-design/mcp": major
---

`get_annotations`가 Figma 앱과 웹소켓 서버 없이 REST 모드에서도 작동하도록 업데이트하고, 누락되던 Annotation을 반환하도록 고칩니다.

- Figma URL 또는 `fileKey` + `nodeId`를 전달하면 REST API로 동작합니다.
- 응답 구조가 `{ annotations: [{ nodeId, labelMarkdowns }] }`에서 `{ nodes: [{ nodeId, annotations }] }`로 변경됩니다. `annotations`의 각 항목은 `label`, `labelMarkdown`, `properties`, `category`를 담습니다. 이 응답을 읽는 프롬프트가 있다면 새 구조에 맞게 수정해야 합니다.
- 조회 대상 레이어 자신에 붙은 Annotation이 결과에서 빠지던 문제를 수정합니다. 이제 대상 레이어와 그 하위 레이어를 모두 반환합니다.
- Text, Rectangle처럼 하위 레이어를 가질 수 없는 레이어를 조회하면 오류가 나던 문제를 수정합니다.
- Annotation 카테고리를 `category: { id, label, color, isPreset }`으로 풀어서 반환합니다. 이전에는 카테고리 정보가 아예 없었습니다.
- REST 모드로 받은 Annotation에는 서식이 제거된 평문 `label`만 담깁니다. Figma에서 작성한 마크다운 원문 `labelMarkdown`과 `category`는 웹소켓 모드에서만 제공됩니다.
