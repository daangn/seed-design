---
"@seed-design/react-snackbar": major
"@seed-design/react": major
---

Snackbar 내부 액션 버튼 클릭 시 `onAction` 핸들러 호출 이후 스낵바가 닫히는 동작을 컴포넌트 기본값으로 제공합니다.

- snippet에 존재하던 deprecate된 `shouldCloseOnAction` 옵션(default: `true`)을 제거합니다.
- 해당 동작을 React 컴포넌트로 이전하여 항상 `true`처럼 동작하도록 변경합니다.
