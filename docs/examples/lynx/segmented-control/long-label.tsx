import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="segmented-control-example">
        <SegmentedControl defaultValue="price" accessibility-label="정렬 기준">
          <SegmentedControlItem value="price">가격 높은 순</SegmentedControlItem>
          <SegmentedControlItem value="discount">할인율 높은 순</SegmentedControlItem>
          <SegmentedControlItem value="popular">인기 많은 순</SegmentedControlItem>
        </SegmentedControl>
      </view>
    </page>
  );
}

root.render(<Root />);
