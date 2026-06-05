import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { VStack } from "@seed-design/react";
import { useState } from "react";

const WIDTH_OPTIONS = ["200px", "300px", "unset"] as const;

export default function HelpBubbleTooltipWidth() {
  const [width, setWidth] = useState<(typeof WIDTH_OPTIONS)[number]>("300px");

  return (
    <VStack gap="spacingY.componentDefault" align="center" p="x10">
      <HelpBubbleTooltipTrigger
        title="Pariatur aliqua commodo eu Lorem minim anim. Lorem ipsum voluptate eu duis eiusmod consequat."
        contentProps={{ style: { width } }}
      >
        <SegmentedControl
          aria-label="너비"
          value={width}
          onValueChange={(value) => setWidth(value as (typeof WIDTH_OPTIONS)[number])}
        >
          {WIDTH_OPTIONS.map((option) => (
            <SegmentedControlItem key={option} value={option}>
              {option}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </HelpBubbleTooltipTrigger>
    </VStack>
  );
}
