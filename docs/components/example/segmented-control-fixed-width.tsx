import { VStack } from "@seed-design/react";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

export default function SegmentedControlFixedWidth() {
  return (
    <VStack align="center" gap="spacingY.componentDefault">
      <SegmentedControl defaultValue="new" style={{ width: "500px" }} aria-label="Sort by">
        <SegmentedControlItem value="new">New</SegmentedControlItem>
        <SegmentedControlItem value="hot">Hot</SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl defaultValue="oneway" style={{ width: "400px" }} aria-label="Trip Type">
        <SegmentedControlItem value="oneway">One Way Trip</SegmentedControlItem>
        <SegmentedControlItem notification value="round">
          Round Trip
        </SegmentedControlItem>
        <SegmentedControlItem notification value="multi">
          Multi-City Journey
        </SegmentedControlItem>
      </SegmentedControl>
    </VStack>
  );
}
