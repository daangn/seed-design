---
"@seed-design/lynx-react": minor
---

`FieldButton.Root`에 `values`·`onValuesChange`를 추가해 `FieldButton.ClearButton`으로 선택값 삭제를 요청할 수 있도록 합니다.

- 이전에는 앱이 `ClearButton.bindtap`에서 직접 값을 지워야 했습니다. 이제 버튼을 누르면 `onValuesChange([])`가 호출되며, 앱에서 `values`를 갱신합니다.
- 기존 `ClearButton.bindtap`에서도 값을 지운다면 같은 변경을 중복 처리하지 않아야 합니다.
