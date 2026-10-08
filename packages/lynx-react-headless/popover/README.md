# @seed-design/lynx-react-popover

Headless component built to implement [SEED Lynx Help Bubble](https://seed-design.io/lynx/components/help-bubble). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { Popover } from "@seed-design/lynx-react-popover";

export function DeliveryHelp() {
  return (
    <Popover.Root placement="top">
      <Popover.Trigger accessibility-label="Show delivery information">
        <text>Delivery information</text>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content>
          <text>Delivery usually takes two business days.</text>
          <Popover.CloseButton accessibility-label="Close delivery information">
            <text>Close</text>
          </Popover.CloseButton>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
}
```
