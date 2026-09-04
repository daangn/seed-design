import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
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
    </page>
  );
}

root.render(<Root />);
