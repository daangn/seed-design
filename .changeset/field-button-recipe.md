---
"@seed-design/css": major
"@seed-design/react": major
---

(BREAKING CHANGE: `@seed-design/css/recipes/input-button`을 `@seed-design/css/recipes/field-button`으로, `.seed-input-button__*` selector를 `.seed-field-button__*`로 바꿔야 합니다.) Field Button의 Recipe 이름을 `input-button`에서 `field-button`으로 변경합니다.

- `inputButton`·`inputButtonVariantMap`·`InputButtonVariantProps`를 `fieldButton`·`fieldButtonVariantMap`·`FieldButtonVariantProps`로 바꿉니다.
- `FieldButton` 컴포넌트만 쓴다면 코드를 바꿀 필요가 없으며, 스타일 값은 그대로입니다.
