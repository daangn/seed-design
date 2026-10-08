# @seed-design/lynx-react-dialog

Headless component built to implement [SEED Lynx Dialog](https://seed-design.io/lynx/components/dialog). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { Dialog } from "@seed-design/lynx-react-dialog";

export function DeliveryDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <text>View delivery details</text>
      </Dialog.Trigger>
      <Dialog.Positioner>
        <Dialog.Backdrop />
        <Dialog.Content>
          <Dialog.Title>Delivery details</Dialog.Title>
          <Dialog.Description>Your order will arrive tomorrow.</Dialog.Description>
          <Dialog.CloseButton>
            <text>Close</text>
          </Dialog.CloseButton>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
```
