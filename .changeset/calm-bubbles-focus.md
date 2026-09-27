---
"@seed-design/react": minor
"@seed-design/css": patch
---

`HelpBubble`의 포커스 관리와 닫힘 동작을 개선합니다.

- 열릴 때 포커스를 HelpBubble 안으로 옮기지 않는 기존 동작은 유지되나, `autoFocus`로 해당 동작에 옵트인할 수 있습니다. (role="dialog" 권장사항)
- 닫힐 때 포커스를 trigger로 되돌립니다.
- `closeOnInteractOutside={false}`인 경우를 제외하고, HelpBubble 내부 요소에서 HelpBubble 밖 요소로 포커스를 이동하면 HelpBubble이 닫힙니다.
- DismissibleLayer 스택에 참여하도록 업데이트하여, BottomSheet, Dialog 등 DismissibleLayer 스택에 참여하는 요소 안에서 HelpBubble을 연 경우 Escape 키와 외부 영역 상호작용 시 두 요소가 동시에 닫히는 문제를 수정합니다.
- `HelpBubble.Title`, `HelpBubble.Description`이 Content의 accessible name과 description이 되도록 수정합니다.
- `@seed-design/react/primitive`의 `Popover`를 직접 사용하는 경우, `@seed-design/react-popover` 변경사항을 참고하여 `Popover.Positioner` 안의 내용을 `Popover.Content`로 감싸도록 변경하세요.
