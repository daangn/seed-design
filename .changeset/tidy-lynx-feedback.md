---
"@seed-design/lynx-react": minor
"@seed-design/lynx-css": minor
---

React·Rootage 명세에 맞춰 Lynx 컴포넌트의 Scale Feedback과 배경색 전환을 보완하고, List를 처음 누를 때 모서리 형태가 바뀌는 문제를 수정합니다.

컴포넌트별 Feedback 변경 사항은 다음과 같습니다.

- `AppBar.IconButton`: 버튼 전체에 Scale Feedback을 추가합니다.
- `ReactionButton`: 고정 축소율을 공통 Scale Feedback으로 교체하고, 선택 상태의 배경색 전환과 비활성·로딩 상태의 Feedback 처리를 보완합니다.
- `InputButton`: 내용 영역에 Scale Feedback과 버튼 배경색 전환을 추가하고, `ClearButton`에는 독립적인 Scale Feedback을 추가합니다.
- `List.ButtonItem`, `List.CheckboxItem`, `List.RadioItem`, `List.SwitchItem`: 내용 영역에 공통 Scale Feedback을 연결하고, 누름 배경이 처음부터 둥근 모서리를 유지하도록 수정합니다. 내부 선택 컨트롤이 중복으로 축소되지 않도록 처리합니다.
- `Menu.Item`: 내용 영역에 Scale Feedback을 추가하고, 누름 배경 Feedback을 보완합니다.
- `SwipeableMenuSheet.Item`, `SwipeableMenuSheet.CloseButton`: 항목의 내용 영역과 닫기 버튼 전체에 각각 Scale Feedback을 추가하고, 누름 배경 Feedback을 보완합니다.
- `PageBanner`: 상호작용 가능한 배너의 내용 영역에 Scale Feedback을 추가하고, 내부 `Button`·`CloseButton`의 Feedback이 배너의 Feedback과 독립적으로 동작하도록 보완합니다.
- `Callout.CloseButton`: 누름 상태의 배경색과 배경색 전환을 추가합니다.
