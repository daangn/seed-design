import { HelpBubbleAnchor } from "seed-design/ui/help-bubble";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { Text, VStack } from "@seed-design/react";
import { useState } from "react";

const WIDTH_OPTIONS = ["200px", "300px", "unset"] as const;
const MAX_WIDTH_OPTIONS = ["200px", "400px", "none"] as const;

export default function HelpBubbleWidth() {
  const [width, setWidth] = useState<(typeof WIDTH_OPTIONS)[number]>("unset");
  const [maxWidth, setMaxWidth] = useState<(typeof MAX_WIDTH_OPTIONS)[number]>("400px");

  return (
    <VStack gap="spacingY.componentDefault" align="center" p="x10">
      <HelpBubbleAnchor
        open
        title="Pariatur aliqua commodo eu Lorem minim anim. Lorem ipsum voluptate eu duis eiusmod consequat."
        contentProps={{ maxWidth, style: { width } }}
      >
        <VStack gap="x4" align="center">
          <VStack gap="x1" align="center">
            <Text>width</Text>
            <SegmentedControl
              aria-label="width"
              value={width}
              onValueChange={(value) => setWidth(value as (typeof WIDTH_OPTIONS)[number])}
            >
              {WIDTH_OPTIONS.map((option) => (
                <SegmentedControlItem key={option} value={option}>
                  {option}
                </SegmentedControlItem>
              ))}
            </SegmentedControl>
          </VStack>
          <VStack gap="x1" align="center">
            <Text>maxWidth</Text>
            <SegmentedControl
              aria-label="maxWidth"
              value={maxWidth}
              onValueChange={(value) => setMaxWidth(value as (typeof MAX_WIDTH_OPTIONS)[number])}
            >
              {MAX_WIDTH_OPTIONS.map((option) => (
                <SegmentedControlItem key={option} value={option}>
                  {option}
                </SegmentedControlItem>
              ))}
            </SegmentedControl>
          </VStack>
        </VStack>
      </HelpBubbleAnchor>
    </VStack>
  );
}
