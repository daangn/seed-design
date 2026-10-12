---
"@seed-design/lynx-react-sortable": minor
---

SEED 스타일 없이 길게 눌러 가로 목록의 순서를 바꾸는 `@seed-design/lynx-react-sortable`을 추가합니다.

- `Sortable.Root`의 `items`·`getItemKey`·`onReorder`로 목록 순서를 관리하고, `Sortable.Item`으로 각 항목을 조합합니다.
- `scrollableBoundaryId`로 가로 `<scroll-view>`를 지정하고, Root의 render prop으로 받는 `onScroll`·`dragging`을 스크롤 이벤트와 `enable-scroll`에 연결해 드래그 중 스크롤 잠금과 가장자리 자동 스크롤을 사용할 수 있습니다.
- `reducedMotion`으로 항목 이동 애니메이션을 끄고, `Sortable.Item`의 `moveActionLabels`로 스크린 리더의 앞·뒤 이동 동작을 지정할 수 있습니다.
