import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-segmented-control-root`}>
      <view className="segmented-control-example">
        <SegmentedControl
          className="segmented-control-example__control"
          defaultValue="Hot"
          accessibility-label="Sort by"
        >
          <SegmentedControlItem value="Hot">Hot</SegmentedControlItem>
          <SegmentedControlItem value="New">New</SegmentedControlItem>
        </SegmentedControl>
      </view>
    </view>
  );
}
