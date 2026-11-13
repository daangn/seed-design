---
"@seed-design/lynx-react-bottom-sheet": minor
"@seed-design/lynx-react": patch
"@seed-design/lynx-css": patch
---

Bottom Sheet·Menu Sheet·Dialog가 LynxView의 `vh`·`vw` 대신 Positioner 레이어를 측정한 크기로 크기와 snap 위치를 계산합니다. 내용 높이로 삽입된 LynxView에서 `container="window"` 시트가 보이지 않던 문제와, `container` 레이어가 LynxView보다 클 때 시트·Dialog의 최대 높이가 LynxView 높이를 기준으로 계산되던 문제를 수정합니다.

- 백분율 snap point는 `screenHeight`·`screenWidth`를 넘기지 않으면 레이어를 측정한 뒤 열리기 시작합니다. 넘긴 값은 계속 우선합니다.
- `useBottomSheetContext()`가 측정한 레이어 크기 `layerSize`를 제공합니다.
- `fit` 시트가 하단 padding만 잡힌 첫 layout 높이에서 멈추던 문제를 수정합니다. 진입 중이거나 열린 `fit` 시트는 내용 높이가 바뀌면 새 높이로 다시 snap합니다. 드래그 중에는 다시 snap하지 않습니다.
