import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleAnchor } from "seed-design/ui/help-bubble";

export default function HelpBubbleFlip() {
  return (
    <HelpBubbleAnchor
      open
      flip={false}
      title="Flip"
      description="Flip을 끄면 화면 경계에서 방향이 바뀌지 않아요."
    >
      <Icon svg={<IconSparkle2 />} />
    </HelpBubbleAnchor>
  );
}
