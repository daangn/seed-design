---
"@seed-design/lynx-css": major
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `InputButton.*`와 `InputButtonRoot`·`InputButtonRootProps` 등 `InputButton*` export를 `FieldButton*`으로 변경해야 합니다. 직접 사용한 `input-button` Recipe와 `seed-input-button__*` class도 `field-button` 이름으로 변경해야 합니다. Registry `ui:field-button`은 `npx @seed-design/cli@latest add ui:field-button`으로 다시 설치하고 `inputButtonRef`를 `controlRef`로 변경해야 합니다.)

Lynx 선택값 필드의 이름을 `InputButton`에서 `FieldButton`으로 변경하며, 기존 스타일 값은 유지합니다.

- 컴포넌트와 Props 타입의 `InputButton*` export를 제거하고 `FieldButton*` export를 제공합니다.
- Recipe 경로는 `@seed-design/lynx-css/recipes/input-button`에서 `@seed-design/lynx-css/recipes/field-button`으로 바뀝니다.
- Recipe의 `inputButton`·`inputButtonVariantMap`·`inputButtonVariantKeys`와 `InputButtonVariantProps`·`InputButtonSlotName`도 각각 `fieldButton*`·`FieldButton*` 이름으로 바뀌며, class는 `seed-field-button__*`로 생성됩니다.
- Registry wrapper가 버튼 ref를 받는 prop은 `inputButtonRef`에서 `controlRef`로 바뀝니다.
