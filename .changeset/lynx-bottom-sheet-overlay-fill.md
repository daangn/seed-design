---
"@seed-design/lynx-react": patch
---

`BottomSheet.Positioner`에 `container`를 지정했을 때 overlay 레이어의 크기가 잡히지 않아 시트가 화면 밖에 그려지던 문제를 수정합니다. Registry 컴포넌트는 `npx @seed-design/cli@latest add ui:bottom-sheet`로 다시 설치해야 `container`와 `overlayLevel`을 전달합니다.
