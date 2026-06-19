---
"@seed-design/react-snackbar": major
"@seed-design/react": major
---

Snackbar 액션 버튼을 클릭하면 항상 스낵바가 닫히도록 동작을 통일합니다.

- `useSnackbar`에 `actionButtonProps`를 추가하고, 이를 사용하는 `Snackbar.ActionButton` 파트를 제공합니다. 액션 버튼은 클릭 시 항상 스낵바를 닫습니다.
- 닫기 로직이 snippet에서 headless로 내려가면서, deprecate되었던 snippet의 `shouldCloseOnAction` 옵션이 제거되었습니다. 자동 닫힘이 표준 동작입니다.
- 패키지를 업그레이드할 때는 snippet도 다시 받아주세요. `shouldCloseOnAction={false}`로 액션 버튼의 닫힘을 막던 코드는 더 이상 동작하지 않습니다.
