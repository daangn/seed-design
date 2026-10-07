import "./styles";

import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";

export default function Example() {
  return (
    <view className="segmented-control-example">
      <SegmentedControl
        className="segmented-control-example__fixed-wide"
        defaultValue="new"
        accessibility-label="Sort by"
      >
        <SegmentedControlItem value="new">New</SegmentedControlItem>
        <SegmentedControlItem value="hot">Hot</SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl
        className="segmented-control-example__fixed-narrow"
        defaultValue="oneway"
        accessibility-label="Trip Type"
      >
        <SegmentedControlItem value="oneway">One Way Trip</SegmentedControlItem>
        <SegmentedControlItem notification value="round">
          Round Trip
        </SegmentedControlItem>
        <SegmentedControlItem notification value="multi">
          Multi-City Journey
        </SegmentedControlItem>
      </SegmentedControl>
    </view>
  );
}
