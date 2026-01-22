---
"@seed-design/rootage-artifacts": minor
"@seed-design/react": minor
"@seed-design/css": minor
---

[Help Bubble](/react/components/help-bubble) 관련 컴포넌트를 업데이트합니다.

- **1.1 → 1.2 업그레이드 시 snippet 업데이트 필요**: `HelpBubbleTrigger` 및 `HelpBubbleAnchor`의 내부 구조가 변경되었습니다. snippet을 다시 내려받아 주세요.
  - `npx @seed-design/cli@latest add ui:help-bubble`
  - **인터페이스 변경사항이 없으므로 `HelpBubbleAnchor`와 `HelpBubbleTrigger`를 사용하는 기존 코드를 변경할 필요가 없습니다.**
  - `HelpBubble.Body`를 사용하여 `HelpBubble.Title`과 `HelpBubble.Description`을 감싸도록 변경되었습니다.
  - `zIndexOffset`을 활용하여 `HelpBubble.Positioner`의 z-index를 조정할 수 있습니다. ([예시](/react/components/help-bubble#z-index-offset))
