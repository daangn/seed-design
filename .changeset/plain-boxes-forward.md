---
"@seed-design/react": patch
---

`CheckSelectBox.Root`와 `RadioSelectBox.Item`에 `asChild`로 요소를 전달해도 그 요소가 컴포넌트의 root로 렌더링되지 않고, 컴포넌트의 스타일과 `ref`가 전달되지 않던 문제를 수정합니다. `footerVisibility="always"`를 지정한 경우에만 정상 동작했습니다.
