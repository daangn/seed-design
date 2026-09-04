import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
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
    </page>
  );
}

root.render(<Root />);
