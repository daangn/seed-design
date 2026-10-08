# @seed-design/lynx-react-use-controllable-state

Headless hook built to implement [SEED Lynx useControllableState](https://seed-design.io/lynx/hooks/use-controllable-state). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";

export function Counter() {
  const [count, setCount] = useControllableState({ defaultValue: 0 });

  return (
    <view
      accessibility-element
      accessibility-traits="button"
      accessibility-label="Increase count"
      bindtap={() => setCount(count + 1)}
    >
      <text>{count}</text>
    </view>
  );
}
```
