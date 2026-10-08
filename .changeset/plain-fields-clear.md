---
"@seed-design/lynx-react": minor
---

`FieldButton.Root`에 `values`·`onValuesChange`를 연결해 `FieldButton.ClearButton`에서 선택값 삭제를 요청할 수 있습니다. 버튼을 누르면 `onValuesChange([])`를 호출하며, 앱에서 `values`를 갱신해야 합니다. 기존 `ClearButton.bindtap`에서 값을 지웠다면 같은 변경을 중복 처리하지 않아야 합니다.
