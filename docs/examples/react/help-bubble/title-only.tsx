import { ActionButton } from "seed-design/ui/action-button";
import { HelpBubbleAnchor } from "seed-design/ui/help-bubble";

export default function HelpBubbleTitleOnly() {
  return (
    <HelpBubbleAnchor open title="Title Only">
      <ActionButton>열기</ActionButton>
    </HelpBubbleAnchor>
  );
}
