---
"@seed-design/lynx-react": minor
"@seed-design/qvism-preset": minor
"@seed-design/lynx-css": minor
---

Lynx Checkbox / RadioGroup 컴포넌트 추가

- `@seed-design/lynx-react` 에 `Checkbox` (Root/Control/Indicator/Label/Group), `RadioGroup` (Root/Item/ItemControl/ItemIndicator/ItemLabel) compound 컴포넌트 추가
- `@seed-design/qvism-preset` 에 `checkbox`, `checkmark`, `checkbox-group`, `radio`, `radiomark`, `radio-group` Lynx recipe 6개 추가
- Lynx-전용 recipe 에서 `checked`/`disabled`/`indeterminate` 를 pseudo selector 대신 boolean variants 로 직접 선언 (qvism 의 `StringToBoolean` 을 활용해 타입 cast 없이 사용 가능)
- `CheckboxIndicator` / `RadioGroupItemIndicator` 는 `@karrotmarket/lynx-monochrome-icon` 의 monochrome icon 컴포넌트를 받아 `cloneElement` + `useIconColor` 패턴으로 `<image tint-color=...>` 의 색상을 recipe CSS `color` 토큰과 동기화
- 웹 대비 미지원 기능 (HiddenInput, form field props, focus/focusVisible, raw `onChange`, deprecated `weight="default"/"stronger"`) 은 JSDoc 에 명시
