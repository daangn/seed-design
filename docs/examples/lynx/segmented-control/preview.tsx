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
          defaultValue="hot"
          accessibility-label="정렬 기준"
        >
          <SegmentedControlItem value="hot">인기순</SegmentedControlItem>
          <SegmentedControlItem value="new">최신순</SegmentedControlItem>
        </SegmentedControl>
      </view>
    </page>
  );
}

root.render(<Root />);
