---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: indeterminate 상태로 표시할 `ProgressCircle`에서는 `value`를 제거해야 합니다.)

`ProgressCircle`은 이전에 `value`·`minValue`·`maxValue`를 모두 전달해야 determinate 상태가 되었지만, 이제 숫자 `value`만으로 진행률을 표시합니다.

- 범위를 생략하면 0에서 100을 사용하며, 표시하는 진행률은 0%에서 100% 사이로 제한합니다.
- 숫자 `value`가 없으면 indeterminate 상태로 표시합니다. Registry `AttachmentField`·`AttachmentDisplayField`의 업로드 항목도 전달받은 진행률을 표시합니다.
