---
"@seed-design/react": minor
"@seed-design/css": patch
---

`HelpBubble`이 `Popover.Content` 기반으로 바뀌어 포커스 관리와 닫힘 동작이 Popover와 같아집니다.

- 열릴 때 포커스를 옮기지 않는 기존 동작은 유지하고, `autoFocus`로 켤 수 있습니다. 닫힐 때는 포커스를 trigger로 되돌립니다.
- 포커스가 밖으로 나가도 닫힙니다. `closeOnInteractOutside={false}`이면 닫히지 않습니다.
- Escape와 외부 영역 누름은 가장 위의 레이어만 닫습니다.
- `HelpBubble.Title`, `HelpBubble.Description`이 Content의 accessible name과 description이 됩니다.
- `@seed-design/react/primitive`의 `Popover`를 직접 사용한다면 `Popover.Positioner` 안의 내용을 `Popover.Content`로 감싸야 합니다. 자세한 내용은 `@seed-design/react-popover` 변경사항을 참고하세요.
