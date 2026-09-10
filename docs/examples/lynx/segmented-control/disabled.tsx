import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="segmented-control-example">
        <SegmentedControl defaultValue="hot" disabled accessibility-label="전체 비활성화">
          <SegmentedControlItem value="hot">인기순</SegmentedControlItem>
          <SegmentedControlItem value="new">최신순</SegmentedControlItem>
        </SegmentedControl>
        <SegmentedControl defaultValue="hot" accessibility-label="일부 비활성화">
          <SegmentedControlItem value="hot">인기순</SegmentedControlItem>
          <SegmentedControlItem value="new" disabled>
            최신순
          </SegmentedControlItem>
        </SegmentedControl>
      </view>
    </page>
  );
}

root.render(<Root />);
