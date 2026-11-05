# @seed-design/react-segmented-text-input

Headless component built to implement [SEED React Segmented Text Input](https://seed-design.io/react/components/segmented-text-input). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "react";
import { SegmentedTextInput } from "@seed-design/react-segmented-text-input";

export function ResidentNumberInput() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <SegmentedTextInput.Root value={value} onValueChange={setValue}>
      <SegmentedTextInput.Segment length={6} aria-label="Resident number, first 6 digits" />
      <SegmentedTextInput.Separator>-</SegmentedTextInput.Separator>
      <SegmentedTextInput.Segment length={1} masked aria-label="Resident number, 7th digit" />
      <SegmentedTextInput.StaticText>●●●●●●</SegmentedTextInput.StaticText>
    </SegmentedTextInput.Root>
  );
}
```
