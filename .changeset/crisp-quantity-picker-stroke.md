---
"@seed-design/lynx-css": minor
"@seed-design/lynx-react": patch
---

iOS에서 `QuantityPicker` 테두리가 흐리게 보이던 문제를 수정합니다. 테두리를 inset `box-shadow` 대신 `stroke` slot의 `border`로 그립니다.

- `@seed-design/lynx-css`의 `quantity-picker` Recipe에 `stroke` slot을 추가합니다.
- `@seed-design/lynx-react`의 `QuantityPicker`는 이 slot을 사용하므로 같은 버전 이상의 `@seed-design/lynx-css`가 필요합니다.
