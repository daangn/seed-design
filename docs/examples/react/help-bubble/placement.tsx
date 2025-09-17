import { Box } from "@seed-design/react";
import { ActionButton } from "@/registry/ui/action-button";
import { HelpBubbleTrigger } from "@/registry/ui/help-bubble";

export default function HelpBubblePreview() {
  return (
    <div className="grid grid-cols-3 gap-20 p-40">
      <HelpBubbleTrigger
        open
        flip={false}
        placement="top-end"
        title="top-end"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleTrigger>
      <HelpBubbleTrigger
        open
        flip={false}
        placement="top"
        title="top"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleTrigger>
      <HelpBubbleTrigger
        open
        flip={false}
        placement="top-start"
        title="top-start"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleTrigger>
      <HelpBubbleTrigger
        open
        flip={false}
        placement="left-end"
        title="left-end"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleTrigger>
      <Box />
      <HelpBubbleTrigger
        open
        flip={false}
        placement="right-end"
        title="right-end"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleTrigger>
      <HelpBubbleTrigger
        open
        flip={false}
        placement="left"
        title="left"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleTrigger>
      <Box />
      <HelpBubbleTrigger
        open
        flip={false}
        placement="right"
        title="right"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleTrigger>
      <HelpBubbleTrigger
        open
        flip={false}
        placement="left-start"
        title="left-start"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleTrigger>
      <Box />
      <HelpBubbleTrigger
        open
        flip={false}
        placement="right-start"
        title="right-start"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleTrigger>
      <HelpBubbleTrigger
        open
        flip={false}
        placement="bottom-end"
        title="bottom-end"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleTrigger>
      <HelpBubbleTrigger
        open
        flip={false}
        placement="bottom"
        title="bottom"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleTrigger>
      <HelpBubbleTrigger
        open
        flip={false}
        placement="bottom-start"
        title="bottom-start"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleTrigger>
    </div>
  );
}
