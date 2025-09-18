import { VStack } from "@seed-design/react";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

export default function SegmentedControlPreview() {
  return (
    <VStack align="center" gap="spacingY.componentDefault">
      <SegmentedControl defaultValue="Hot" disabled aria-label="Sort by">
        <SegmentedControlItem value="Hot">Hot</SegmentedControlItem>
        <SegmentedControlItem value="New">New</SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl defaultValue="Marinara" aria-label="Pasta">
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
    </VStack>
  );
}
