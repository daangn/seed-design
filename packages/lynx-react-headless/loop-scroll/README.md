# @seed-design/lynx-react-loop-scroll

Headless component built to implement [SEED Lynx Wheel Picker](https://seed-design.io/lynx/components/wheel-picker). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { LoopScroll } from "@seed-design/lynx-react-loop-scroll";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function DayPicker() {
  const [index, setIndex] = useState(0);

  return (
    <LoopScroll.Root
      itemCount={days.length}
      itemSize={44}
      visibleItemCount={5}
      index={index}
      onIndexChange={setIndex}
      accessibility-element
      accessibility-label="Day"
      accessibility-value={days[index]}
    >
      <LoopScroll.Track accessibility-elements-hidden>
        {({ index }) => <text>{days[index]}</text>}
      </LoopScroll.Track>
      <LoopScroll.Highlight>
        <LoopScroll.Track>{({ index }) => <text>{days[index]}</text>}</LoopScroll.Track>
      </LoopScroll.Highlight>
    </LoopScroll.Root>
  );
}
```
