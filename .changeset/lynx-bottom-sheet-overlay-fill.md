---
"@seed-design/lynx-react-bottom-sheet": patch
"@seed-design/lynx-react": patch
---

`BottomSheet.Positioner`에 `container`를 지정하면 Dialog와 같이 overlay 레이어를 채우도록 너비와 높이를 `100%`로 맞춥니다. 이전에는 overlay 모드에서 레이어 크기가 잡히지 않아 시트가 화면 밖에 그려졌습니다.
