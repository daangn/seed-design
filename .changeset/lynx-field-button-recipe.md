---
"@seed-design/lynx-css": major
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `InputButton.*`와 `InputButtonRoot`·`InputButtonRootProps` 등 `InputButton*` export를 `FieldButton*`으로 변경해야 합니다. 직접 사용한 `input-button` Recipe와 `seed-input-button__*` class도 `field-button` 이름으로 변경해야 합니다. Registry `ui:field-button`은 `npx @seed-design/cli@latest add ui:field-button`으로 다시 설치하고 `inputButtonRef`를 `controlRef`로 변경해야 합니다.) Lynx 선택값 필드의 이름을 `InputButton`에서 `FieldButton`으로 변경합니다.

Recipe를 직접 사용하거나 class selector로 스타일을 지정했다면 함께 변경해야 합니다.

- `@seed-design/lynx-css/recipes/input-button` → `@seed-design/lynx-css/recipes/field-button`
- `inputButton`·`inputButtonVariantMap`·`inputButtonVariantKeys` → `fieldButton`·`fieldButtonVariantMap`·`fieldButtonVariantKeys`
- `InputButtonVariantProps`·`InputButtonSlotName` → `FieldButtonVariantProps`·`FieldButtonSlotName`
- `seed-input-button__*` → `seed-field-button__*`

기존 스타일 값은 유지합니다.
