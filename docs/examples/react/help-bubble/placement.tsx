import { Box } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { HelpBubbleAnchor } from "seed-design/ui/help-bubble";

export default function HelpBubblePreview() {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px", padding: "60px" }}
    >
      <HelpBubbleAnchor
        open
        flip={false}
        placement="top-end"
        title="top-end"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleAnchor>
      <HelpBubbleAnchor open flip={false} placement="top" title="top" description="est tempor aute">
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleAnchor>
      <HelpBubbleAnchor
        open
        flip={false}
        placement="top-start"
        title="top-start"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleAnchor>
      <HelpBubbleAnchor
        open
        flip={false}
        placement="left-end"
        title="left-end"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleAnchor>
      <Box />
      <HelpBubbleAnchor
        open
        flip={false}
        placement="right-end"
        title="right-end"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleAnchor>
      <HelpBubbleAnchor
        open
        flip={false}
        placement="left"
        title="left"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleAnchor>
      <Box />
      <HelpBubbleAnchor
        open
        flip={false}
        placement="right"
        title="right"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleAnchor>
      <HelpBubbleAnchor
        open
        flip={false}
        placement="left-start"
        title="left-start"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleAnchor>
      <Box />
      <HelpBubbleAnchor
        open
        flip={false}
        placement="right-start"
        title="right-start"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleAnchor>
      <HelpBubbleAnchor
        open
        flip={false}
        placement="bottom-end"
        title="bottom-end"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleAnchor>
      <HelpBubbleAnchor
        open
        flip={false}
        placement="bottom"
        title="bottom"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleAnchor>
      <HelpBubbleAnchor
        open
        flip={false}
        placement="bottom-start"
        title="bottom-start"
        description="est tempor aute"
      >
        <ActionButton variant="neutralWeak">열기</ActionButton>
      </HelpBubbleAnchor>
    </div>
  );
}
