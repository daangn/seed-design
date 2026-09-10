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
          className="segmented-control-example__fixed"
          defaultValue="oneway"
          accessibility-label="Trip Type"
        >
          <SegmentedControlItem value="oneway">One Way Trip</SegmentedControlItem>
          <SegmentedControlItem value="round">Round Trip</SegmentedControlItem>
          <SegmentedControlItem value="multi">Multi-City Journey</SegmentedControlItem>
        </SegmentedControl>
      </view>
    </page>
  );
}

root.render(<Root />);
