---
"@seed-design/react-popover": major
---

(BREAKING CHANGE: `Popover.Positioner` 안의 내용을 `Popover.Content`로 감싸야 합니다. `role="dialog"`와 aria 속성이 `Popover.Content`로 이동했으므로, 직접 지정한 `aria-label`·`aria-labelledby`·`aria-describedby`도 `Popover.Content`에 전달해야 합니다.) `Popover.Content`, `Popover.Title`, `Popover.Description`을 추가합니다.

- 열릴 때 Content로 포커스를 옮기고, 내부에 포커스가 있는 상태에서 닫히면 trigger로 포커스를 되돌리도록 수정합니다. Root의 `autoFocus={false}`로 열릴 때 포커스를 옮기지 않게 할 수 있습니다.
- `closeOnInteractOutside={false}`인 경우를 제외하고, 포커스가 Popover 밖으로 나가면 Popover가 닫히도록 수정합니다.
- Dialog, Bottom Sheet 등 다른 레이어 안에서 연 Popover를 Escape 키나 바깥 영역을 눌러 닫을 때, 바깥 레이어까지 함께 닫히던 문제를 수정합니다.
- Root에 `lazyMount`, `unmountOnExit` 옵션을 추가합니다.
- `onOpenChange`의 두 번째 인자로 `reason`과 원인 이벤트를 전달합니다.
