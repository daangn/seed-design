---
"@seed-design/react-popover": major
---

(BREAKING CHANGE: dialog role, 포커스 이동, 접근성 이름 연결을 적용하려면 `Popover.Positioner` 안의 내용을 `Popover.Content`로 감싸야 합니다.) `@seed-design/react-popover`에 `Popover.Content`, `Popover.Title`, `Popover.Description`을 추가하고, 포커스 관리와 닫힘 처리를 바꿉니다.

- dialog role과 trigger의 `aria-controls` 대상 id를 Positioner 대신 Content에 설정합니다.
- Content는 열릴 때 포커스를 받고, 닫힐 때 트리거로 포커스를 되돌립니다. `lazyMount`, `unmountOnExit`로 마운트 시점을 제어할 수 있습니다.
- Title·Description이 렌더되면 Content에 `aria-labelledby`, `aria-describedby`를 연결합니다.
- Escape 키와 외부 영역 누름은 SEED 공용 dismissible layer stack에서 처리합니다. 가장 위에 있는 레이어만 닫히고, 상위 레이어가 닫히면 함께 닫힙니다.
- `onOpenChange` 두 번째 인자로 열림 상태가 바뀐 이유를 전달합니다.
- `Popover.Positioner`는 제자리에 렌더하고, `Popover.PositionerPortal`은 portal로 렌더합니다.

Tab·Shift+Tab으로 Popover를 벗어나면 이동 대상의 포커스를 유지합니다. 상위 FocusScope가 있는 화면에서도 포커스 이탈 중 닫힘 처리 때문에 화면 루트로 포커스가 이동하지 않습니다.
