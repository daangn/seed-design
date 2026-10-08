# @seed-design/lynx-react-callout

Headless component built to implement [SEED Lynx Callout](https://seed-design.io/lynx/components/callout). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { Callout } from "@seed-design/lynx-react-callout";

export function DeliveryCallout() {
  return (
    <Callout.Root defaultOpen>
      <view>
        <text>Delivery update</text>
        <text>Your order will arrive tomorrow.</text>
      </view>
      <Callout.CloseButton accessibility-label="Dismiss delivery update">
        <text>Dismiss</text>
      </Callout.CloseButton>
    </Callout.Root>
  );
}
```
