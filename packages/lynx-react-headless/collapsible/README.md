# @seed-design/lynx-react-collapsible

Headless component built to implement [SEED Lynx Accordion](https://seed-design.io/lynx/components/accordion). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { Collapsible } from "@seed-design/lynx-react-collapsible";

export function DeliveryDetails() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger>
        <text>Delivery details</text>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <text>Orders usually arrive within three business days.</text>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
```
