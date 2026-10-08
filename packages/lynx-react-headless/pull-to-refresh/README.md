# @seed-design/lynx-react-pull-to-refresh

Headless component built to implement [SEED Lynx Pull To Refresh](https://seed-design.io/lynx/components/pull-to-refresh). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { PullToRefresh } from "@seed-design/lynx-react-pull-to-refresh";

interface RefreshableListProps {
  items: string[];
  onRefresh: () => Promise<void>;
}

export function RefreshableList({ items, onRefresh }: RefreshableListProps) {
  return (
    <PullToRefresh.Root onPtrRefresh={onRefresh} style={{ height: "400px" }}>
      <PullToRefresh.Indicator>
        {({ value }) => <text>{value === undefined ? "Refreshing..." : "Pull to refresh"}</text>}
      </PullToRefresh.Indicator>
      <PullToRefresh.Content style={{ height: "100%" }}>
        {items.map((item) => (
          <text key={item}>{item}</text>
        ))}
      </PullToRefresh.Content>
    </PullToRefresh.Root>
  );
}
```
