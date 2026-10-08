---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: indeterminate 상태로 표시할 `ProgressCircle`에서는 `value`를 제거해야 합니다.) `ProgressCircle`은 숫자 `value`가 있으면 기본 범위 0에서 100의 determinate 상태로 표시하고, 범위를 벗어난 값은 최솟값 또는 최댓값으로 제한합니다. 따라서 Registry `AttachmentField`·`AttachmentDisplayField`의 업로드 항목도 전달받은 진행률을 표시합니다.
