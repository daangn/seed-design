# @seed-design/lynx-react-quantity-picker

Headless component built to implement [SEED Lynx Quantity Picker](https://seed-design.io/lynx/components/quantity-picker). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { QuantityPicker } from "@seed-design/lynx-react-quantity-picker";

export function ItemQuantity() {
  const [quantity, setQuantity] = useState(1);

  return (
    <QuantityPicker.Root min={1} max={10} value={quantity} onValueChange={setQuantity}>
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
