---
"@seed-design/lynx-css": minor
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: `SwipeableMenuSheet.List`나 `.seed-menu-sheet__list`로 그룹 배치(flex·gap)를 바꾸고 있었다면 `.seed-menu-sheet__listContent`를 덮어쓰거나 그룹을 직접 감싼 view로 옮겨야 합니다. `AlertDialog.Content`의 `className`·`style`로 자식 배치를 바꾸고 있었다면 자식을 직접 감싼 view로 옮겨야 합니다. `BottomSheet.Body` 안에 `scroll-view`를 두어 긴 내용을 스크롤하고 있었다면 그 `scroll-view`를 빼고 내용을 `Body`에 바로 넣고, 높이 제한은 `Body`의 `maxHeight`로 옮기고, `Body`에 준 `flex: "none"`은 지워야 합니다. `Body`의 `className`·`style`로 자식 배치를 바꾸고 있었다면 `.seed-bottom-sheet__scrollContent`를 덮어쓰거나 자식을 직접 감싼 view로 옮겨야 하고, `Body` 안의 `ScrollFog`에 `height: "100%"`를 주고 있었다면 고정 높이로 바꿔야 합니다.) 화면 끝을 기준으로 위치를 잡는 Lynx 컴포넌트가 노치·홈 인디케이터·가로 화면의 측면 safe area inset을 피하도록 수정합니다. Backdrop은 그대로 화면 전체를 덮습니다.

- `Dialog`·`AlertDialog`·`BottomSheet`·`SwipeableMenuSheet`는 좌우 inset을 뺀 영역의 가운데에 놓입니다. `Dialog`의 기본 너비(90%)는 그 영역을 기준으로 계산합니다.
- `Dialog`·`AlertDialog`는 위아래 inset도 피합니다. `Dialog`의 최대 높이는 화면 높이의 80%와 위아래 inset 사이 높이 중 작은 쪽입니다.
- `AlertDialog.Content`는 자식을 세로 `scroll-view` 안에 렌더해서, 내용이 최대 높이를 넘으면 안에서 스크롤합니다. `Content`에 준 `className`·`style`은 이 `scroll-view`를 감싼 바깥 view에 적용됩니다.
- 내용에 맞춰 높이가 정해지는 `BottomSheet`·`SwipeableMenuSheet`는 화면 높이의 90%를 넘지 않고, 위쪽 inset이 그보다 크면 inset 아래까지로 제한됩니다. 제한에 닿으면 `BottomSheet.Body`가 스크롤됩니다.
- 내용에 맞춰 높이가 정해지는 `BottomSheet`에서 `Body`가 내용 높이만큼 커집니다. 이전에는 `Body`에 최소 높이를 주지 않으면 높이가 0이 되어 내용이 보이지 않았습니다.
- `BottomSheet.Body`는 자식을 세로 `scroll-view` 안에 렌더해서, 내용이 넘치면 `Body`만 스크롤합니다. `Body`에 준 `className`·`style`은 이 `scroll-view`를 감싼 바깥 view에 적용되고, 자식 배치는 새 `scrollContent` 슬롯이 맡습니다. `Body`가 스크롤된 상태에서 시작한 제스처는 `Body`만 움직이고, `Body`가 맨 위일 때 아래로 끌어야 시트가 움직입니다.
- `SwipeableMenuSheet.List`는 `scroll-view`로 렌더해서, 항목이 넘치면 목록만 스크롤하고 헤더와 닫기 버튼은 줄이지 않습니다. `List`의 `className`·`style`·`ref`는 이 `scroll-view`에 적용되고, 그룹 배치는 새 `listContent` 슬롯이 맡습니다. 목록이 스크롤된 상태에서 시작한 제스처는 목록만 움직이고, 목록이 맨 위일 때 아래로 끌어야 시트가 움직입니다.
- `Menu`·`Select`·`HelpBubble`은 네 방향의 inset을 피해 위치를 잡고, `overflowPadding`을 화면 끝이 아니라 safe area 경계에서부터 잽니다.
