# @seed-design/lynx-react-bottom-sheet

Headless component built to implement [SEED Lynx Bottom Sheet](https://seed-design.io/lynx/components/bottom-sheet). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { BottomSheet } from "@seed-design/lynx-react-bottom-sheet";

export function DeliveryDetailsSheet() {
  return (
    <BottomSheet.Root snapPoints={["fit"]}>
      <BottomSheet.Trigger>
        <text>View delivery details</text>
      </BottomSheet.Trigger>
      <BottomSheet.Positioner>
        <BottomSheet.Backdrop />
        <BottomSheet.Content>
          <BottomSheet.Handle />
          <text>Your order will arrive within three business days.</text>
          <BottomSheet.CloseButton>
            <text>Close</text>
          </BottomSheet.CloseButton>
        </BottomSheet.Content>
      </BottomSheet.Positioner>
    </BottomSheet.Root>
  );
}
```
