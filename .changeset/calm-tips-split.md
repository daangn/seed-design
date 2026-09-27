---
"@seed-design/react-popover": major
---

(BREAKING CHANGE: `Popover.Positioner` 안의 내용을 `Popover.Content`로 감싸야 합니다. dialog role과 aria 속성이 Positioner에서 Content로 옮겨 갑니다.) `Popover.Content`, `Popover.Title`, `Popover.Description`을 추가합니다.

- 열릴 때 Content로 포커스를 옮기고 닫힐 때 trigger로 되돌립니다. 포커스를 가두지 않습니다. Root의 `autoFocus={false}`로 끌 수 있습니다.
- 포커스가 밖으로 나가도 닫힙니다. `closeOnInteractOutside={false}`이면 이 경우에도 닫히지 않습니다.
- Escape와 외부 영역 누름은 가장 위의 레이어만 닫고, 상위 Dialog·Drawer가 닫히면 함께 닫힙니다.
- Root에 `lazyMount`, `unmountOnExit`를 추가합니다.
- `onOpenChange`의 두 번째 인자로 `reason`과 원인 이벤트를 전달합니다.
