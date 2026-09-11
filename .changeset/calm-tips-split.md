---
"@seed-design/react-popover": major
---

(BREAKING CHANGE: 기존 HelpBubble용 primitive 사용자는 `@seed-design/react-toggle-tip`의 `ToggleTip`과 `useToggleTipContext`로 import와 이름을 변경해야 합니다.) `@seed-design/react-popover`를 Popover 전용 headless로 분리합니다.

기존 클릭형 도움말 동작은 새 `@seed-design/react-toggle-tip` 패키지로 옮깁니다. 현재는 non-modal `dialog` 방식이며, live region 방식이나 모드 선택 API는 제공하지 않습니다. `@seed-design/react`의 `HelpBubble` 사용자는 코드를 변경할 필요가 없습니다.

Popover를 구성할 때는 `Popover.Positioner` 또는 `Popover.PositionerPortal` 안에 `Popover.Content`를 사용해야 합니다. dialog role과 trigger의 `aria-controls` 대상 id는 Content에 설정됩니다. Content는 포커스 이동과 presence를 처리하고, Title·Description이 렌더되면 접근성 이름과 설명을 연결합니다.

Tab·Shift+Tab으로 Popover를 벗어나면 이동 대상의 포커스를 유지합니다. 상위 FocusScope가 있는 화면에서도 포커스 이탈 중 닫힘 처리 때문에 화면 루트로 포커스가 이동하지 않습니다.
