---
"@seed-design/react": minor
"@seed-design/css": minor
"@seed-design/rootage-artifacts": minor
---

Popover 컴포넌트를 추가합니다.

- trigger 또는 `PopoverAnchor`를 기준으로 떠 있는 컨테이너이며, Header·Body·Footer 구조를 제공합니다.
- `PopoverBody`는 내용이 넘칠 때만 상단 divider와 하단 scroll fog를 표시합니다.
- `PopoverFooter` 안의 `PopoverAction`을 누르면 Popover가 닫힙니다. `onClick`에서 `e.preventDefault()`를 호출하면 닫히지 않습니다.
- 포커스를 가두지 않아 배경을 계속 조작할 수 있습니다.
- `npx @seed-design/cli@latest add ui:popover`로 설치할 수 있습니다.
