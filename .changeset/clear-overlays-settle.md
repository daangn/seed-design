---
"@seed-design/css": patch
"@seed-design/lynx-css": patch
"@seed-design/rootage-artifacts": patch
"@seed-design/react-floating": patch
"@seed-design/react-menu": patch
"@seed-design/react-navigation-menu": patch
"@seed-design/react-select": patch
---

노치·홈 인디케이터·가로 화면의 측면 inset이 있는 기기에서 오버레이 컴포넌트가 safe area inset 영역에 걸치지 않도록 수정합니다. Backdrop과 시트·패널의 배경은 계속 화면 끝까지 채웁니다.

- Dialog: 가로로는 좌우 inset을 뺀 영역의 가운데에 놓이고, 기본 너비(90%)와 최대 너비도 그 영역을 기준으로 계산합니다. 세로로는 위아래 inset 중 큰 값만큼 양쪽을 비워 화면 정중앙에 놓이고, 최대 높이는 화면 높이의 80%와 그 사이 높이 중 작은 쪽입니다.
- AlertDialog: 가로로는 좌우 inset을 뺀 영역의 가운데에 놓이고, 좌우 여백(32px)이 inset 안쪽에서부터 적용됩니다. 세로로는 위아래 inset 중 큰 값만큼 양쪽을 비워 화면 정중앙에 놓이고, 내용이 그 사이 높이보다 길면 AlertDialog 높이가 거기서 멈추고 내용은 AlertDialog 안에서 스크롤됩니다.
- BottomSheet: 가로로는 좌우 inset을 뺀 영역의 가운데에 놓이고, 너비는 최대 너비와 그 영역의 너비 중 작은 쪽입니다. 내용이 길면 BottomSheet 높이가 화면 높이의 90%(새 토큰 `content.maxHeightFraction`)로 제한되고, 화면 위쪽 safe area가 그보다 크면 safe area 아래로 제한됩니다. 넘친 내용은 `BottomSheetBody`가 스크롤합니다.
- MenuSheet·SwipeableMenuSheet: 가로로는 좌우 inset을 뺀 영역의 가운데에 놓이고, 너비는 최대 너비와 그 영역의 너비 중 작은 쪽입니다. 항목이 많으면 시트 높이가 화면 높이의 90%(새 토큰 `content.maxHeightFraction`)로 제한되고, 화면 위쪽 safe area가 그보다 크면 safe area 아래로 제한됩니다. 넘친 항목은 `MenuSheetList`(`SwipeableMenuSheetList`)가 스크롤합니다.
- SidePanel: 너비(md 미만 80%, md 이상 Width 토큰)와 `width`·`maxWidth`로 지정한 값이 콘텐츠 너비가 됩니다. 붙는 쪽에 좌우 inset이 있으면 패널이 그만큼 넓어지고 그 영역을 배경으로 덮습니다. md 미만의 80%와 최대 너비는 좌우 inset을 뺀 너비를 기준으로 합니다. inset은 `env(safe-area-inset-*)` 대신 `--seed-safe-area-*` 변수로 읽습니다. `maxWidth`를 덮어써 패널의 반대쪽 가장자리가 화면 반대편 inset에 닿으면, 닿는 만큼 헤더·본문·푸터와 닫기 버튼이 안쪽으로 들어옵니다.
- Snackbar: 영역이 `env(safe-area-inset-*)` 대신 `--seed-safe-area-*` 변수로 좌우·아래 safe area를 피합니다. 기본 상태에서 보이는 위치는 같습니다. `--seed-safe-area-left`·`--seed-safe-area-right`를 직접 덮어쓰는 앱에서는 Snackbar의 좌우 위치도 그 값을 따릅니다.
- Popover·HelpBubble·HelpBubbleTooltip·NavigationMenu: 화면 가장자리 근처에서 위치를 잡을 때 네 방향의 safe area inset을 피합니다. inset이 있는 가장자리에서는 `overflowPadding` 대신 inset을 기준으로 밀리거나 뒤집히고 가용 크기가 계산되며, inset이 없는 가장자리는 지금처럼 `overflowPadding`을 씁니다.
- Menu·Select: 위아래에 더해 좌우 safe area inset도 같은 방식으로 피합니다.
