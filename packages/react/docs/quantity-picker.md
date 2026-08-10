file: components/quantity-picker.mdx

# Quantity Picker

정수 단위의 수량을 늘리거나 줄일 때 사용하는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@2.1.0, @seed-design/css@2.3.0

## Preview

```tsx
import { QuantityPicker } from "seed-design/ui/quantity-picker";

export default function QuantityPickerPreview() {
  return <QuantityPicker min={1} max={99} defaultValue={1} aria-label="상품 수량" />;
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:quantity-picker
- pnpm: pnpm dlx @seed-design/cli@latest add ui:quantity-picker
- yarn: yarn dlx @seed-design/cli@latest add ui:quantity-picker
- bun: bun x @seed-design/cli@latest add ui:quantity-picker

<ManualInstallation name="quantity-picker" />

## Props \[#props]

- `value`
  - type: `number | undefined`
  - description: 제어 상태에서 현재 수량을 지정합니다.
- `defaultValue`
  - type: `number | undefined`
  - description: 비제어 상태에서 초기 수량을 지정합니다. 지정하지 않으면 \`min\`을 사용합니다.
- `onValueChange`
  - type: `((value: number) => void) | undefined`
  - description: 수량이 변경될 때 호출됩니다.
- `min`
  - type: `number`
  - required: `true`
  - description: 선택할 수 있는 최소 수량입니다.
- `max`
  - type: `number`
  - required: `true`
  - description: 선택할 수 있는 최대 수량입니다.
- `step`
  - type: `number | undefined`
  - default: `1`
  - description: 한 번의 조작으로 변경할 수량입니다.
- `disabled`
  - type: `boolean | undefined`
  - default: `false`
  - description: 모든 조작을 비활성화합니다.
- `invalid`
  - type: `boolean | undefined`
  - default: `false`
  - description: 수량이 유효하지 않은 상태임을 나타냅니다.
- `readOnly`
  - type: `boolean | undefined`
  - default: `false`
  - description: 값을 표시하되 변경할 수 없도록 합니다.
- `loading`
  - type: `QuantityPickerLoading | undefined`
  - description: 전체 또는 특정 action을 loading 상태로 전환하고 해당 조작을 막습니다.
- `removable`
  - type: `boolean | undefined`
  - default: `false`
  - description: 값이 \`min\`일 때 Decrement 버튼을 Remove 버튼으로 전환합니다.
- `onRemove`
  - type: `(() => void) | undefined`
  - description: Remove 버튼을 누를 때 호출됩니다.
- `removeAriaLabel`
  - type: `string | undefined`
  - default: `"상품 삭제"`
  - description: Remove 버튼의 접근성 이름입니다.
- `getValueText`
  - type: `QuantityPickerGetValueText | undefined`
  - description: 표시할 수량 텍스트를 반환합니다. 단위나 보조 설명을 덧붙일 때 사용합니다.
- `size`
  - type: `"small" | "medium" | "large" | undefined`
  - default: `"medium"`
  - description: 컴포넌트의 크기입니다.
- `dir`
  - type: `"ltr" | "rtl" | undefined`
  - default: `"ltr"`
  - description: 버튼과 값의 배치 방향입니다.
- `decrementAriaLabel`
  - type: `string | undefined`
  - default: `"수량 줄이기"`
  - description: Decrement 버튼의 접근성 이름입니다.
- `incrementAriaLabel`
  - type: `string | undefined`
  - default: `"수량 늘리기"`
  - description: Increment 버튼의 접근성 이름입니다.
- `decrementIcon`
  - type: `React.ReactNode`
  - default: `<IconMinusLine />`
  - description: Decrement 버튼에 표시할 아이콘입니다.
- `incrementIcon`
  - type: `React.ReactNode`
  - default: `<IconPlusLine />`
  - description: Increment 버튼에 표시할 아이콘입니다.
- `removeIcon`
  - type: `React.ReactNode`
  - default: `<IconTrashcanLine />`
  - description: Remove 버튼에 표시할 아이콘입니다.
- `loadingIndicator`
  - type: `React.ReactNode`
  - default: `<ProgressCircle size="inherit" tone="inherit" />`
  - description: loading 상태일 때 버튼에 표시할 요소입니다.
- `inputProps`
  - type: `SeedQuantityPicker.HiddenInputProps | undefined`
  - description: 현재 수량을 form으로 제출할 때 hidden input에 전달할 속성입니다.
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Value Text \[#value-text]

`getValueText`를 사용하면 표시되는 수량에 단위나 보조 설명을 덧붙일 수 있습니다.

```tsx
import { QuantityPicker } from "seed-design/ui/quantity-picker";

export default function QuantityPickerValueText() {
  return (
    <QuantityPicker
      min={1}
      max={99}
      defaultValue={1}
      aria-label="상품 수량"
      getValueText={(valueText: string) => `${valueText}개`}
    />
  );
}
```

### Controlled \[#controlled]

`value`와 `onValueChange`를 사용해 수량 상태를 외부에서 제어할 수 있습니다.

```tsx
import { Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { QuantityPicker } from "seed-design/ui/quantity-picker";

export default function QuantityPickerControlled() {
  const [quantity, setQuantity] = useState(2);

  return (
    <VStack gap="x3" align="center">
      <QuantityPicker
        min={1}
        max={99}
        value={quantity}
        onValueChange={setQuantity}
        aria-label="상품 수량"
      />
      <Text textStyle="t4Regular">현재 수량: {quantity}개</Text>
    </VStack>
  );
}
```

### Removable \[#removable]

`removable`을 사용하면 값이 `min`에 도달했을 때 Decrement 버튼이 Remove 버튼으로 전환됩니다. `onRemove`에서 제거 동작을 처리하세요.

```tsx
import { Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { QuantityPicker } from "seed-design/ui/quantity-picker";

export default function QuantityPickerRemovable() {
  const [removed, setRemoved] = useState(false);

  if (removed) {
    return (
      <VStack gap="x3" align="center">
        <Text textStyle="t4Regular">상품을 삭제했습니다.</Text>
        <ActionButton variant="neutralWeak" onClick={() => setRemoved(false)}>
          되돌리기
        </ActionButton>
      </VStack>
    );
  }

  return (
    <VStack gap="x3" align="center">
      <QuantityPicker
        min={1}
        max={99}
        defaultValue={1}
        removable
        aria-label="상품 수량"
        removeAriaLabel="상품 삭제"
        onRemove={() => setRemoved(true)}
      />
      <Text textStyle="t4Regular">최소 수량에서 Decrement 버튼이 Remove 버튼으로 전환됩니다.</Text>
    </VStack>
  );
}
```

### Loading \[#loading]

`loading`으로 모든 action 또는 특정 action의 실행을 일시적으로 막고 loading indicator를 표시할 수 있습니다.

```tsx
import { HStack, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { QuantityPicker } from "seed-design/ui/quantity-picker";

export default function QuantityPickerLoading() {
  const [decrementLoading, setDecrementLoading] = useState(false);
  const [incrementLoading, setIncrementLoading] = useState(false);
  const allLoading = decrementLoading && incrementLoading;

  function toggleAllLoading() {
    const nextLoading = !allLoading;
    setDecrementLoading(nextLoading);
    setIncrementLoading(nextLoading);
  }

  return (
    <VStack gap="x3" align="center">
      <QuantityPicker
        min={1}
        max={99}
        defaultValue={2}
        loading={
          allLoading
            ? true
            : {
                decrement: decrementLoading,
                increment: incrementLoading,
              }
        }
        aria-label="상품 수량"
      />
      <HStack gap="x2">
        <ActionButton variant="neutralWeak" aria-pressed={allLoading} onClick={toggleAllLoading}>
          전체
        </ActionButton>
        <ActionButton
          variant="neutralWeak"
          aria-pressed={decrementLoading}
          onClick={() => setDecrementLoading((current) => !current)}
        >
          Decrement
        </ActionButton>
        <ActionButton
          variant="neutralWeak"
          aria-pressed={incrementLoading}
          onClick={() => setIncrementLoading((current) => !current)}
        >
          Increment
        </ActionButton>
      </HStack>
    </VStack>
  );
}
```

### Form \[#form]

`inputProps`에 `name`을 전달하면 현재 수량이 hidden input으로 제출됩니다.

```tsx
import { VStack } from "@seed-design/react";
import type { FormEvent } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { QuantityPicker } from "seed-design/ui/quantity-picker";

export default function QuantityPickerForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    window.alert(`제출한 수량: ${formData.get("quantity")}개`);
  }

  return (
    <VStack asChild gap="x3" align="center">
      <form onSubmit={handleSubmit}>
        <QuantityPicker
          min={1}
          max={99}
          defaultValue={1}
          aria-label="상품 수량"
          inputProps={{ name: "quantity" }}
        />
        <ActionButton type="submit" variant="neutralSolid">
          제출
        </ActionButton>
      </form>
    </VStack>
  );
}
```

## Accessibility \[#accessibility]

Root에는 Quantity Picker의 용도를 설명하는 `aria-label` 또는 `aria-labelledby`를 제공하세요. 필요하면 `decrementAriaLabel`, `incrementAriaLabel`, `removeAriaLabel`로 각 action의 접근성 이름을 맥락에 맞게 변경할 수 있습니다.

`getValueText`를 사용하면 ValueDisplay의 숫자를 사람이 읽기 쉬운 텍스트로 제공할 수 있습니다. 이 값은 hidden input에 제출되는 raw integer 값에 영향을 주지 않습니다.