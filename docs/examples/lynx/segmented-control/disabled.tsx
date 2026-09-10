import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-segmented-control-root`}>
      <view className="segmented-control-example">
        <SegmentedControl defaultValue="Hot" disabled accessibility-label="Sort by">
          <SegmentedControlItem value="Hot">Hot</SegmentedControlItem>
          <SegmentedControlItem value="New">New</SegmentedControlItem>
        </SegmentedControl>
        <SegmentedControl defaultValue="Marinara" accessibility-label="Pasta">
          <SegmentedControlItem value="Marinara">Marinara</SegmentedControlItem>
          <SegmentedControlItem value="Alfredo" disabled>
            Alfredo
          </SegmentedControlItem>
          <SegmentedControlItem value="Pesto" disabled>
            Pesto
          </SegmentedControlItem>
          <SegmentedControlItem value="Carbonara">Carbonara</SegmentedControlItem>
          <SegmentedControlItem value="Bolognese">Bolognese</SegmentedControlItem>
        </SegmentedControl>
      </view>
    </view>
  );
}
