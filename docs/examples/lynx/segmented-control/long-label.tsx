import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-segmented-control-root`}>
      <view className="segmented-control-example">
        <SegmentedControl defaultValue="price" accessibility-label="정렬 기준">
          <SegmentedControlItem value="price">가격 높은 순</SegmentedControlItem>
          <SegmentedControlItem value="discount">할인율 높은 순</SegmentedControlItem>
          <SegmentedControlItem value="popular">인기 많은 순</SegmentedControlItem>
        </SegmentedControl>
      </view>
    </view>
  );
}
