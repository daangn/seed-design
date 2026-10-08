# @seed-design/lynx-react-use-safe-area

Headless hook built to implement [SEED Lynx useSafeArea](https://seed-design.io/lynx/hooks/use-safe-area). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useSafeArea } from "@seed-design/lynx-react-use-safe-area";

export function Screen() {
  const { safeAreaInsetTop, safeAreaInsetRight, safeAreaInsetBottom, safeAreaInsetLeft } =
    useSafeArea();

  return (
    <view
      style={{
        paddingTop: safeAreaInsetTop,
        paddingRight: safeAreaInsetRight,
        paddingBottom: safeAreaInsetBottom,
        paddingLeft: safeAreaInsetLeft,
      }}
    >
      <text>Screen content</text>
    </view>
  );
}
```
