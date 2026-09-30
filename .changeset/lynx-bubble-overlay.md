---
"@seed-design/lynx-react": minor
---

HelpBubble을 native overlay 레이어에 렌더링할 수 있습니다.

- `HelpBubble.Positioner`에 `container`·`overlayLevel`·`overlayViewProps`를 추가합니다. `container`를 지정하면 Lynx view 밖까지 덮는 overlay 레이어에 렌더링합니다. 이때 overlay 사이의 순서는 `zIndexOffset`이 아니라 `overlayLevel`과 표시 순서가 정합니다.
- Registry `ui:help-bubble`의 `HelpBubbleTrigger`·`HelpBubbleAnchor`가 `container`·`overlayLevel`을 받습니다. `npx @seed-design/cli@latest add ui:help-bubble`로 스니펫을 갱신할 수 있습니다.
