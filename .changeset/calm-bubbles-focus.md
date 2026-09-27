---
"@seed-design/react": major
"@seed-design/css": patch
---

(BREAKING CHANGE: `HelpBubble`의 dialog role이 `HelpBubble.Content`로 옮겨 가므로, positioner 요소의 role이나 id에 의존하던 코드는 Content를 기준으로 바꿔야 합니다.) `HelpBubble`이 Popover와 같은 포커스 관리와 닫힘 처리를 사용합니다.

- 열릴 때 `HelpBubble.Content`로 포커스를 옮기고, 닫힐 때 트리거로 되돌립니다. `HelpBubble.Anchor`로 열어도 같습니다.
- Tab 등으로 포커스가 밖으로 이동하면 닫힙니다.
- `HelpBubble.Title`, `HelpBubble.Description`이 렌더되면 Content에 `aria-labelledby`, `aria-describedby`를 연결합니다.
- Escape 키와 외부 영역 누름은 SEED 공용 dismissible layer stack에서 처리합니다. Dialog 안에서 Escape를 누르면 HelpBubble만 닫힙니다.
- `HelpBubble.Root`에서 `lazyMount`, `unmountOnExit`를 사용할 수 있습니다.
