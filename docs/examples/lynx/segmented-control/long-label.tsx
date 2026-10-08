import "./styles";

import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";

export default function Example() {
  return (
    <SegmentedControl defaultValue="price" accessibility-label="정렬 기준">
      <SegmentedControlItem value="price">가격 높은 순</SegmentedControlItem>
      <SegmentedControlItem value="discount">할인율 높은 순</SegmentedControlItem>
      <SegmentedControlItem value="popular">인기 많은 순</SegmentedControlItem>
    </SegmentedControl>
  );
}
