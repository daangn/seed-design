import "./styles";

import { root, useState } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<string | null>(null);

  function handleValueChange(nextValue: string) {
    "background only";
    setCount((previous) => previous + 1);
    setLastValue(nextValue);
  }

  return (
    <page className={seedClassName}>
      <view className="segmented-control-example">
        <SegmentedControl
          defaultValue="hot"
          onValueChange={handleValueChange}
          accessibility-label="Sort by"
        >
          <SegmentedControlItem value="hot">Hot</SegmentedControlItem>
          <SegmentedControlItem value="new">New</SegmentedControlItem>
        </SegmentedControl>
        <text className="segmented-control-example__status">
          onValueChange called: {count} times, last value: {lastValue ?? "-"}
        </text>
      </view>
    </page>
  );
}

root.render(<Root />);
