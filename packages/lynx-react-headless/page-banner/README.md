# @seed-design/lynx-react-page-banner

Headless component built to implement [SEED Lynx Page Banner](https://seed-design.io/lynx/components/page-banner). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { PageBanner } from "@seed-design/lynx-react-page-banner";

export function UpdatesBanner({ onViewUpdates }: { onViewUpdates: () => void }) {
  return (
    <PageBanner.Root defaultOpen>
      <text>A new version is available.</text>
      <PageBanner.Button bindtap={onViewUpdates}>
        <text>View updates</text>
      </PageBanner.Button>
      <PageBanner.CloseButton accessibility-label="Dismiss update notice">
        <text>Dismiss</text>
      </PageBanner.CloseButton>
    </PageBanner.Root>
  );
}
```
