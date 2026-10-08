# @seed-design/lynx-react-radio-group

Headless component built to implement [SEED Lynx Radio Group](https://seed-design.io/lynx/components/radio-group). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { RadioGroup, useRadioGroupItemContext } from "@seed-design/lynx-react-radio-group";

function RadioIndicator() {
  const { checked } = useRadioGroupItemContext();

  return <text>{checked ? "Selected" : ""}</text>;
}

export function DeliveryOptions() {
  const [value, setValue] = useState("pickup");

  return (
    <RadioGroup.Root value={value} onValueChange={setValue} accessibility-label="Delivery method">
      <RadioGroup.Label>Delivery method</RadioGroup.Label>
      <RadioGroup.Item value="pickup" accessibility-label="Pick up">
        <RadioGroup.ItemControl>
          <RadioIndicator />
        </RadioGroup.ItemControl>
        <text>Pick up</text>
      </RadioGroup.Item>
      <RadioGroup.Item value="delivery" accessibility-label="Delivery">
        <RadioGroup.ItemControl>
          <RadioIndicator />
        </RadioGroup.ItemControl>
        <text>Delivery</text>
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
}
```
