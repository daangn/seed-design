---
"@seed-design/lynx-react-loop-scroll": minor
---

세로 드래그와 관성 스크롤로 항목을 선택하는 휠 UI를 조합할 수 있는 `@seed-design/lynx-react-loop-scroll`을 추가합니다.

- `LoopScroll.Root`·`Track`·`Highlight`를 조합하고 `itemCount`·`itemSize`·`visibleItemCount`로 표시 영역을 지정합니다. `Track`의 render callback으로 항목 내용을 그립니다.
- `loop`로 마지막 항목 다음에 첫 항목이 이어지게 반복합니다.
- `index`·`defaultIndex`로 선택 상태를 지정하고, `onIndexChange`로 조작 후 정착한 항목을, `onActiveIndexChange`로 조작 중 지나가는 항목을 확인할 수 있습니다.
