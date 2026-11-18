import IconSparkle2 from "@karrotmarket/lynx-multicolor-icon/IconSparkle2";

import { HelpBubbleAnchor } from "@/components/ui/help-bubble";

export default function Example() {
  return (
    <HelpBubbleAnchor open title="제목" description="제목 아래에 부연 설명을 덧붙일 수 있어요.">
      <IconSparkle2 />
    </HelpBubbleAnchor>
  );
}
