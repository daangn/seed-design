---
"@seed-design/mcp": minor
---

`get_annotations`가 Figma 앱과 웹소켓 서버 없이 REST 모드에서도 작동하도록 업데이트하고, 반환 결과를 개선합니다.

- 조회 대상 레이어 자신에 붙은 Annotation이 결과에서 빠지던 문제를 수정합니다.
- Text, Rectangle처럼 하위 레이어를 가질 수 없는 레이어를 조회하면 오류가 나던 문제를 수정합니다.
- Annotation 카테고리를 `category: { id, label, color, isPreset }`으로 반환합니다.
- Annotation이 붙은 레이어의 `name`, `type`, 그리고 조회 대상부터 해당 레이어까지의 상위 레이어 정보를 `path`로 반환합니다.
