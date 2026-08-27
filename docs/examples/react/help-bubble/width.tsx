import { HelpBubbleAnchor } from "seed-design/ui/help-bubble";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { VStack } from "@seed-design/react";
import { useState } from "react";

const MAX_WIDTH_OPTIONS = ["200px", "400px", "none"] as const;

export default function HelpBubbleWidth() {
  const [maxWidth, setMaxWidth] = useState<(typeof MAX_WIDTH_OPTIONS)[number]>("400px");

  return (
    <VStack gap="spacingY.componentDefault" align="center" p="x10">
      <HelpBubbleAnchor
        open
        title="Pariatur aliqua commodo eu Lorem minim anim. Lorem ipsum voluptate eu duis eiusmod consequat."
        contentProps={{ maxWidth }}
      >
        <SegmentedControl
          aria-label="최대 너비"
          value={maxWidth}
          onValueChange={(value) => setMaxWidth(value as (typeof MAX_WIDTH_OPTIONS)[number])}
        >
          {MAX_WIDTH_OPTIONS.map((option) => (
            <SegmentedControlItem key={option} value={option}>
              {option}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </HelpBubbleAnchor>
    </VStack>
  );
}
