import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleAnchor } from "seed-design/ui/help-bubble";

export default function HelpBubbleDescription() {
  return (
    <HelpBubbleAnchor open title="제목" description="제목 아래에 부연 설명을 덧붙일 수 있어요.">
      <Icon svg={<IconSparkle2 />} />
    </HelpBubbleAnchor>
  );
}
