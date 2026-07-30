---
"@seed-design/react-pull-to-refresh": patch
---

iOS에서 아래로 스크롤하려는 빠른 플릭을 pull 제스처로 오인식해, 손을 떼는 순간 콘텐츠가 위로 튕기던 문제를 수정합니다. 브라우저가 제스처를 취소한 경우에도 pull 상태에 머무르지 않습니다.

`onPtrRefresh`가 반환한 Promise가 reject되면 로딩 상태에서 벗어나지 못하던 문제도 함께 수정합니다. 이제 실패한 새로고침도 상태를 되돌려 다음 pull 제스처를 받을 수 있습니다.

pull 중에 `disabled`가 켜져 제스처가 끊길 때도 `onPtrPullEnd`가 호출됩니다. 기존에는 `onPtrPullStart`만 불리고 짝이 되는 종료 콜백이 누락됐습니다.
