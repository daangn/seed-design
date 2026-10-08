---
"@seed-design/lynx-css": major
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `@seed-design/lynx-css/recipes/input-button`의 `inputButton`·`inputButtonVariantMap`·`InputButtonVariantProps`를 `@seed-design/lynx-css/recipes/field-button`의 `fieldButton`·`fieldButtonVariantMap`·`FieldButtonVariantProps`로, `seed-input-button__*` class selector를 `seed-field-button__*`로 바꿔야 합니다.) Lynx FieldButton의 Recipe와 class 이름을 컴포넌트 이름에 맞춥니다. `FieldButton`이 렌더링하는 class도 `seed-field-button__*`로 바뀌며, 스타일은 그대로입니다.
