---
"@seed-design/react": major
"@seed-design/css": patch
---

(BREAKING CHANGE: dialog role과 id가 positioner에서 `HelpBubble.Content`로 옮겨 가므로, 이에 의존하던 코드는 Content를 기준으로 바꿔야 합니다.) `HelpBubble`에 Popover와 같은 포커스 관리와 닫힘 처리를 적용합니다.

- 열릴 때 Content로 포커스를 옮기고, 닫힐 때 trigger로 되돌립니다. 포커스가 밖으로 나가면 닫히며, `closeOnInteractOutside`가 `false`이면 닫히지 않습니다.
- `HelpBubble.Title`, `HelpBubble.Description`을 Content의 `aria-labelledby`, `aria-describedby`로 연결합니다.
- Escape와 외부 영역 누름은 가장 위의 레이어만 닫습니다. Dialog 안에서 Escape를 누르면 HelpBubble만 닫힙니다.
- `HelpBubble.Root`에서 `lazyMount`, `unmountOnExit`를 사용할 수 있습니다.
