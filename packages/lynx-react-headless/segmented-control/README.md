# @seed-design/lynx-react-segmented-control

Headless component built to implement [SEED Lynx Segmented Control](https://seed-design.io/lynx/components/segmented-control). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { SegmentedControl } from "@seed-design/lynx-react-segmented-control";

export function ListingFilter() {
  const [value, setValue] = useState("all");

  return (
    <SegmentedControl.Root
      value={value}
      onValueChange={setValue}
      accessibility-label="Listing filter"
    >
      <SegmentedControl.Item value="all" accessibility-label="All listings">
        <text>All listings</text>
      </SegmentedControl.Item>
      <SegmentedControl.Item value="available" accessibility-label="Available">
        <text>Available</text>
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}
```
