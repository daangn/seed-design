# @seed-design/lynx-react-segmented-text-input

Headless component built to implement [SEED Lynx Segmented Text Input](https://seed-design.io/lynx/components/segmented-text-input). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { SegmentedTextInput } from "@seed-design/lynx-react-segmented-text-input";

export function CardNumberInput() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <SegmentedTextInput.Root value={value} onValueChange={setValue}>
      <SegmentedTextInput.Segment length={4} accessibility-label="Card number, group 1" />
      <SegmentedTextInput.Segment length={4} accessibility-label="Card number, group 2" />
      <SegmentedTextInput.Segment length={4} masked accessibility-label="Card number, group 3" />
      <SegmentedTextInput.Segment length={4} masked accessibility-label="Card number, group 4" />
    </SegmentedTextInput.Root>
  );
}
```

The value is a `string[]` in the order the input segments first rendered. Each segment renders one native `<input>`, or a `<text>` when read-only. Typing that fills a segment moves focus to the next one. An input that adds more than one character at once is treated as a paste and split across the following segments, stopping before a `masked` or read-only segment.

`masked` keeps the caret at the end of the value but does not hide the native text; hide it in your styles.
