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

기존 `@seed-design/react/primitive`의 headless `Popover`를 직접 사용했다면 다음 두 작업이 필요합니다. React 3에서는 해당 entrypoint가 제거됩니다.

1. `bun add @seed-design/react-popover@^3.0.0`으로 의존성을 추가하고, `Popover`의 import 경로를 `@seed-design/react-popover`로 바꾸세요.
2. `Popover.Positioner` 또는 `Popover.PositionerPortal` 안의 내용을 `Popover.Content`로 감싸세요. 직접 지정한 `role`과 `aria-label`·`aria-labelledby`·`aria-describedby`도 Content로 옮기세요.

HelpBubble과 해당 snippet에는 새 headless Content를 사용하는 구조가 이미 반영되어 있으므로 기존 사용 코드를 수정할 필요가 없습니다. Headless Popover의 포커스·닫힘 동작 변경은 [React 3 업그레이드 가이드](https://seed-design.io/react/updates/upgrade/v3#headless-popover를-사용한-경우)를 참고하세요.
