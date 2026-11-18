# @seed-design/lynx-react-progress

Headless component built to implement [SEED Lynx Progress Circle](https://seed-design.io/lynx/components/progress-circle). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { ProgressCircle, useProgressCircleContext } from "@seed-design/lynx-react-progress";

function ProgressLabel() {
  const { indeterminate, percent } = useProgressCircleContext();

  return <text>{indeterminate ? "Uploading..." : `${Math.round(percent)}%`}</text>;
}

export function UploadProgress({ value }: { value?: number }) {
  return (
    <ProgressCircle.Root value={value} accessibility-label="Upload progress">
      <ProgressCircle.Track />
      <ProgressCircle.Range>
        <ProgressLabel />
      </ProgressCircle.Range>
    </ProgressCircle.Root>
  );
}
```
