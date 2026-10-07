---
"@seed-design/css": patch
"@seed-design/react-floating": patch
"@seed-design/react-menu": patch
"@seed-design/react-navigation-menu": patch
"@seed-design/react-select": patch
---

화면 끝을 기준으로 위치를 잡는 컴포넌트가 노치·홈 인디케이터·가로 화면의 측면 safe area inset을 피하도록 수정합니다. Backdrop과 시트·패널 배경은 그대로 화면 끝까지 채웁니다.

- Dialog·AlertDialog·BottomSheet·MenuSheet는 좌우 inset을 뺀 영역의 가운데에 놓이고, 너비도 그 영역을 넘지 않습니다. Dialog의 기본 너비(90%)는 그 영역을 기준으로 계산합니다.
- Dialog·AlertDialog는 위아래 inset도 피합니다. Dialog의 최대 높이는 화면 높이의 80%와 위아래 inset 사이 높이 중 작은 쪽입니다.
- BottomSheet·MenuSheet의 높이는 화면 높이의 90%를 넘지 않고, 위쪽 inset이 그보다 크면 inset 아래까지로 제한됩니다. 넘친 내용은 시트 안에서 스크롤합니다.
- SidePanel은 붙는 쪽의 inset만큼 넓어지고, 콘텐츠는 inset 안쪽에 놓입니다. md 미만의 기본 너비(80%)는 좌우 inset을 뺀 너비를 기준으로 계산합니다.
- Popover·HelpBubble·Menu·Select·NavigationMenu는 네 방향의 inset을 피해 위치를 잡고, `overflowPadding`을 화면 끝이 아니라 safe area 경계에서부터 잽니다.
