import { IconStarFill } from "@karrotmarket/react-monochrome-icon";
import { Box, Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipPlacement() {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "80px", padding: "80px" }}
    >
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="top-end"
        title="top-end"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="top-end">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="top"
        title="top"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="top">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="top-start"
        title="top-start"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="top-start">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="left-end"
        title="left-end"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="left-end">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <Box />
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="right-end"
        title="right-end"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="right-end">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="left"
        title="left"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="left">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <Box />
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="right"
        title="right"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="right">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="left-start"
        title="left-start"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="left-start">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <Box />
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="right-start"
        title="right-start"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="right-start">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="bottom-end"
        title="bottom-end"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="bottom-end">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="bottom"
        title="bottom"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="bottom">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        flip={false}
        placement="bottom-start"
        title="bottom-start"
        description="est tempor aute"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="bottom-start">
          <Icon svg={<IconStarFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
    </div>
  );
}
