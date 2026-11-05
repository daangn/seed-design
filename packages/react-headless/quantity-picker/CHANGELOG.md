# @seed-design/react-quantity-picker

## 1.0.0

### Major Changes

- 19f07f5: QuantityPicker 컴포넌트를 추가합니다.

  - 지정한 최소·최대 수량 범위에서 값을 증감할 수 있으며, 최소 수량에서 제거 동작을 지원합니다.
  - `size`, `disabled`, `readOnly`, `invalid`, 증감 중 loading 상태를 지원합니다.
  - 폼 제출에 사용할 수 있는 `QuantityPicker.HiddenInput`을 제공합니다.
  - `ui:quantity-picker` snippet으로 설치할 수 있으며, `@seed-design/css@^2.3.0`을 사용합니다.

  ```tsx
  <QuantityPicker.Root min={0} max={99} defaultValue={1}>
    <QuantityPicker.DecrementButton icon={<IconMinusLine />} />
    <QuantityPicker.ValueDisplay />
    <QuantityPicker.IncrementButton icon={<IconPlusLine />} />
    <QuantityPicker.HiddenInput name="quantity" />
  </QuantityPicker.Root>
  ```

### Patch Changes

- Updated dependencies [4dad2e9]
  - @seed-design/dom-utils@2.1.0
