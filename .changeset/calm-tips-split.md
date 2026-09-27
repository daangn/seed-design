---
"@seed-design/react-popover": major
---

(BREAKING CHANGE: `Popover.Positioner` 안의 내용을 `Popover.Content`로 감싸야 합니다. dialog role과 trigger의 `aria-controls` 대상이 Positioner에서 Content로 옮겨 갑니다.) `Popover.Content`, `Popover.Title`, `Popover.Description`을 추가하고 포커스 관리와 닫힘 처리를 바꿉니다.

- 열릴 때 Content로 포커스를 옮기고, 닫힐 때 trigger로 되돌립니다. 포커스를 가두지 않으며, Tab 등으로 포커스가 밖으로 나가면 닫힙니다. `closeOnInteractOutside`가 `false`이면 외부 영역을 누르거나 포커스가 밖으로 나가도 닫히지 않습니다.
- Title·Description이 렌더되면 Content에 `aria-labelledby`, `aria-describedby`를 연결합니다.
- Escape와 외부 영역 누름은 SEED 공용 dismissible layer stack에서 처리합니다. 가장 위의 레이어만 닫히고, 상위 레이어가 닫히면 함께 닫힙니다.
- Root에 `lazyMount`, `unmountOnExit`를 추가합니다.
- `onOpenChange`의 두 번째 인자로 `reason`(`"trigger"`, `"closeButton"`, `"escapeKeyDown"`, `"interactOutside"`, `"focusOut"`, `"cascadeDismiss"`)과 원인 이벤트를 전달합니다.
