import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleAnchor } from "seed-design/ui/help-bubble";

export default function HelpBubbleTitleOnly() {
  return (
    <HelpBubbleAnchor open title="Title Only">
      <Icon svg={<IconSparkle2 />} />
    </HelpBubbleAnchor>
  );
}
