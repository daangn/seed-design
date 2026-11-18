---
"@seed-design/lynx-react-text-field": minor
"@seed-design/lynx-react": patch
---

Lynx Text Field의 여백·prefix·suffix를 탭하면 입력이 focus되지 않고, 다른 입력이 focus된 상태에서는 키보드가 내려가던 문제를 수정합니다.

- `TextFieldRoot`는 어디를 탭해도 입력을 focus하며, `disabled`·`readOnly`에서는 focus하지 않습니다. 탭이 다른 입력의 focus를 해제하지 않도록 `ignore-focus`를 기본으로 적용하고, 입력에는 `ignore-focus={false}`를 적용합니다. 두 값 모두 직접 지정할 수 있습니다.
- Headless `useTextField`가 Root native view에 펼칠 `rootProps`를 반환합니다.
