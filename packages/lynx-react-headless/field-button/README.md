# @seed-design/lynx-react-field-button

Headless component built to implement [SEED Lynx Field Button](https://seed-design.io/lynx/components/field-button). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { FieldButton } from "@seed-design/lynx-react-field-button";

export function DeliveryDateField({
  openDatePicker,
}: {
  openDatePicker: (onSelect: (dates: string[]) => void) => void;
}) {
  const [dates, setDates] = useState<string[]>([]);

  return (
    <FieldButton.Root values={dates} onValuesChange={setDates}>
      <FieldButton.Button
        accessibility-label="Choose a delivery date"
        bindtap={() => openDatePicker(setDates)}
      >
        <text>{dates.length > 0 ? dates.join(", ") : "Choose a delivery date"}</text>
      </FieldButton.Button>
      {dates.length > 0 && (
        <FieldButton.ClearButton accessibility-label="Clear delivery date">
          <text>Clear</text>
        </FieldButton.ClearButton>
      )}
      <FieldButton.Description>Choose when your order should arrive.</FieldButton.Description>
    </FieldButton.Root>
  );
}
```
