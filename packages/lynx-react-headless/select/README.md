# @seed-design/lynx-react-select

Headless component built to implement [SEED Lynx Select](https://seed-design.io/lynx/components/select). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { Select } from "@seed-design/lynx-react-select";

export function CategorySelect() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger accessibility-label="Category">
        <Select.Value />
        <Select.Placeholder>Choose a category</Select.Placeholder>
      </Select.Trigger>
      <Select.Positioner>
        <Select.Content>
          <Select.ScrollArea>
            <Select.Item value="furniture" label="Furniture">
              <text>Furniture</text>
            </Select.Item>
            <Select.Item value="books" label="Books">
              <text>Books</text>
            </Select.Item>
          </Select.ScrollArea>
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}
```
