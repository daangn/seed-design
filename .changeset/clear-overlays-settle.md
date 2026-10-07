---
"@seed-design/css": patch
"@seed-design/react-popover": patch
"@seed-design/react": patch
---

화면 끝을 기준으로 위치를 잡는 컴포넌트가 노치·홈 인디케이터·가로 화면의 측면 safe area inset을 피하도록 수정합니다. Backdrop과 시트 배경은 그대로 화면 끝까지 채웁니다.

- Dialog·BottomSheet·MenuSheet는 좌우 inset을 뺀 영역의 가운데에 놓이고, 너비도 그 영역을 넘지 않습니다.
- Dialog는 위아래 inset도 피하고, 높이가 그 사이를 넘으면 안에서 스크롤합니다.
- BottomSheet·MenuSheet의 높이는 화면 높이의 90%를 넘지 않고, 위쪽 inset이 그보다 크면 inset 아래까지로 제한됩니다. 넘친 내용은 시트 안에서 스크롤합니다.
- Snackbar는 좌우와 하단 inset을 `--seed-safe-area-*` 변수로 피합니다.
- HelpBubble은 네 방향의 inset을 피해 위치를 잡고, `overflowPadding`을 화면 끝이 아니라 safe area 경계에서부터 잽니다.
