---
"@seed-design/react-popover": major
---

(BREAKING CHANGE: `Popover.Positioner` 안의 내용을 `Popover.Content`로 감싸야 합니다. dialog role과 aria 속성이 Positioner에서 Content로 이동했습니다.) `Popover.Content`, `Popover.Title`, `Popover.Description`을 추가합니다.

- 열릴 때 Content로 포커스를 옮기고 닫힐 때 trigger로 되돌리도록 수정합니다. Root의 `autoFocus={false}`로 열릴 때 포커스 동작을 끌 수 있습니다.
- `closeOnInteractOutside={false}`인 경우를 제외하고, 포커스가 밖으로 나가는 경우 Popover가 닫히도록 수정합니다.
- DismissibleLayer 스택에 참여하도록 업데이트합니다.
- Root에 `lazyMount`, `unmountOnExit` 옵션을 추가합니다.
- `onOpenChange`의 두 번째 인자로 `reason`과 원인 이벤트를 전달합니다.
