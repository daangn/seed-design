---
"@seed-design/react": minor
---

Help Bubble의 포커스 관리와 닫힘 동작을 개선합니다.

- 열릴 때 포커스를 Help Bubble 안으로 옮기지 않는 기본 동작은 그대로입니다. `autoFocus`를 지정하면 열릴 때 Help Bubble 안으로 포커스를 옮기며, `role="dialog"` 요소의 접근성 권장 사항에 맞는 방식입니다.
- Help Bubble 안에 포커스가 있는 상태에서 닫히면 포커스를 trigger로 되돌립니다.
- `closeOnInteractOutside={false}`인 경우를 제외하고, Help Bubble 안의 요소에서 Help Bubble 밖의 요소로 포커스를 옮기면 Help Bubble이 닫힙니다.
- Bottom Sheet, Dialog 등 다른 레이어 안에서 연 Help Bubble을 Escape 키나 바깥 영역을 눌러 닫을 때, 바깥 레이어까지 함께 닫히던 문제를 수정합니다.
- `HelpBubble.Title`과 `HelpBubble.Description`을 Help Bubble의 접근성 이름과 설명으로 연결합니다. `role="dialog"`와 접근성 속성은 Positioner가 아닌 Content 요소(`.seed-help-bubble__content`)에 붙습니다.
- `@seed-design/react/primitive`에서 `Popover`를 가져와 직접 사용했다면, `@seed-design/react-popover`에서 가져오도록 import를 바꾸고 `@seed-design/react-popover` 변경사항에 따라 `Popover.Positioner` 안의 내용을 `Popover.Content`로 감싸세요.
