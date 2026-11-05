import IconSparkle2 from "@karrotmarket/lynx-multicolor-icon/IconSparkle2";

import { HelpBubbleAnchor } from "@/components/ui/help-bubble";

export default function Example() {
  return (
    <HelpBubbleAnchor
      open
      flip={false}
      title="Flip"
      description="Flip을 끄면 화면 경계에서 방향이 바뀌지 않아요."
    >
      <IconSparkle2 />
    </HelpBubbleAnchor>
  );
}
