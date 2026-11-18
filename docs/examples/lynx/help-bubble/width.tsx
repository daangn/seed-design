import { useState } from "@lynx-js/react";
import { Text, VStack } from "@seed-design/lynx-react";
import { HelpBubbleAnchor } from "@/components/ui/help-bubble";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";

const WIDTH_OPTIONS = ["200px", "300px", "unset"] as const;
const MAX_WIDTH_OPTIONS = ["200px", "400px", "none"] as const;

type Width = (typeof WIDTH_OPTIONS)[number];
type MaxWidth = (typeof MAX_WIDTH_OPTIONS)[number];

export default function Example() {
  const [width, setWidth] = useState<Width>("unset");
  const [maxWidth, setMaxWidth] = useState<MaxWidth>("400px");

  function handleWidthChange(nextWidth: string) {
    "background only";
    setWidth(nextWidth as Width);
  }

  function handleMaxWidthChange(nextMaxWidth: string) {
    "background only";
    setMaxWidth(nextMaxWidth as MaxWidth);
  }

  return (
    <HelpBubbleAnchor
      open
      title="Pariatur aliqua commodo eu Lorem minim anim. Lorem ipsum voluptate eu duis eiusmod consequat."
      contentProps={{ maxWidth, style: { width } }}
    >
      <VStack gap="x4" align="center">
        <VStack gap="x1" align="center">
          <Text>width</Text>
          <SegmentedControl
            value={width}
            onValueChange={handleWidthChange}
            accessibility-label="width"
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
            value={maxWidth}
            onValueChange={handleMaxWidthChange}
            accessibility-label="maxWidth"
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
  );
}
