# @seed-design/lynx-react-scale-feedback

Headless utility built to implement [SEED Lynx Scale Feedback](https://seed-design.io/lynx/components/concepts/scale-feedback). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { useScaleFeedback } from "@seed-design/lynx-react-scale-feedback";

export function SaveButton() {
  const [saved, setSaved] = useState(false);
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback();

  return (
    <view
      {...scaleFeedbackTriggerProps}
      {...scaleFeedbackTargetProps}
      bindtap={() => setSaved((value) => !value)}
      accessibility-element={true}
      accessibility-traits="button"
      accessibility-label={saved ? "Unsave item" : "Save item"}
    >
      <text>{saved ? "Saved" : "Save"}</text>
    </view>
  );
}
```
