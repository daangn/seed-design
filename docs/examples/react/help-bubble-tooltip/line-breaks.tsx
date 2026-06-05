import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { HStack, Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";

export default function HelpBubbleTooltipLineBreaks() {
  return (
    <HStack gap="x16">
      <HelpBubbleTooltipTrigger
        title={
          <>
            Breaking
            <br />
            lines
            <br />
            using
            <br />
            `&lt;br /&gt;`s
          </>
        }
      >
        <Icon svg={<IconSparkle2 />} />
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger title={"Breaking\nlines\nusing\nnewlines"}>
        <Icon svg={<IconSparkle2 />} />
      </HelpBubbleTooltipTrigger>
    </HStack>
  );
}
