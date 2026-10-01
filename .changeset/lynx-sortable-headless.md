---
"@seed-design/lynx-react-sortable": minor
---

SEED 스타일 없이 가로 목록의 long-press 정렬을 조합하는 `@seed-design/lynx-react-sortable`을 추가합니다. `Sortable.Root`는 `items`·`getItemKey`로 순서를 읽고, 항목을 다른 위치에 놓으면 `onReorder(fromIndex, toIndex)`를 호출합니다. 취소, 같은 위치, drag 중 `items` 변경, `disabled`·`readOnly`에서는 호출하지 않습니다. drag 중 scroll 잠금과 가장자리 자동 scroll, `reducedMotion` 입력을 제공합니다. `Sortable.Item`은 `moveActionLabels`로 스크린 리더의 한 칸 앞·뒤 이동 동작을 제공합니다.
