import "./styles";

import IconSparkle2 from "@karrotmarket/lynx-multicolor-icon/IconSparkle2";

import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { HelpBubbleAnchor } from "@/components/ui/help-bubble";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-help-bubble-root`}>
      <VStack width="full" height="320px" align="center" justify="center">
        <HelpBubbleAnchor open title="Title Only">
          <IconSparkle2 />
        </HelpBubbleAnchor>
      </VStack>
    </view>
  );
}
