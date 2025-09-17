import { ActionButton } from "@/registry/ui/action-button";
import { HelpBubbleTrigger } from "@/registry/ui/help-bubble";

export default function HelpBubbleTitleOnly() {
  return (
    <HelpBubbleTrigger open title="Title Only">
      <ActionButton>열기</ActionButton>
    </HelpBubbleTrigger>
  );
}
