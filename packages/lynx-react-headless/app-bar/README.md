# @seed-design/lynx-react-app-bar

Headless component built to implement [SEED Lynx App Bar](https://seed-design.io/lynx/components/app-bar). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { AppBar } from "@seed-design/lynx-react-app-bar";

export function ProfileAppBar({ onBack }: { onBack: () => void }) {
  return (
    <AppBar.Root>
      <AppBar.Left>
        <AppBar.IconButton accessibility-label="Go back" bindtap={onBack}>
          <text>Back</text>
        </AppBar.IconButton>
      </AppBar.Left>
      <AppBar.Main>
        <text>Profile</text>
      </AppBar.Main>
      <AppBar.Right />
    </AppBar.Root>
  );
}
```
