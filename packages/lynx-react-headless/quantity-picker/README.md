# @seed-design/lynx-react-quantity-picker

Headless component built to implement [SEED Lynx Quantity Picker](https://seed-design.io/lynx/components/quantity-picker). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { QuantityPicker } from "@seed-design/lynx-react-quantity-picker";

export function ItemQuantity() {
  const [quantity, setQuantity] = useState(1);

  return (
    <QuantityPicker.Root
      min={1}
      max={10}
      value={quantity}
      onValueChange={setQuantity}
      accessibility-label="Item quantity"
    >
      <QuantityPicker.DecrementButton accessibility-label="Decrease quantity">
        <text>Decrease</text>
      </QuantityPicker.DecrementButton>
      <QuantityPicker.ValueDisplay />
      <QuantityPicker.IncrementButton accessibility-label="Increase quantity">
        <text>Increase</text>
      </QuantityPicker.IncrementButton>
    </QuantityPicker.Root>
  );
}
```

## Accessibility

Root is a container, not an accessibility element by default. DecrementButton and IncrementButton are independent accessibility elements with their own labels and button state, and use `flatten={false}` by default.

ValueDisplay is an independent accessibility element with `flatten={false}`. Root's `accessibility-label` is not set on Root; ValueDisplay uses it as its own label and the current quantity as its `accessibility-value`. String and number results from `getValueText` become the accessible value; other results use the raw quantity. Its default text child is hidden from accessibility to avoid duplicate exposure.

Native props on each component override its defaults. Override the accessible name or current value on ValueDisplay rather than Root.
