import { IconILowercaseSerifCircleFill } from "@karrotmarket/react-monochrome-icon";
import { HStack, Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

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
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="br 줄바꿈">
          <Icon svg={<IconILowercaseSerifCircleFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger title={"Breaking\nlines\nusing\nnewlines"}>
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="개행 줄바꿈">
          <Icon svg={<IconILowercaseSerifCircleFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
    </HStack>
  );
}
