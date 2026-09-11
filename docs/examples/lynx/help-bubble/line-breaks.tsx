import "./styles";

import IconSparkle2 from "@karrotmarket/lynx-multicolor-icon/IconSparkle2";

import { HStack, useSeedClassName } from "@seed-design/lynx-react";
import { HelpBubbleAnchor } from "@/components/ui/help-bubble";

const explicitLineBreakTitle = (
  <text>
    {"Breaking"}
    {"\n"}
    {"lines"}
    {"\n"}
    {"using"}
    {"\n"}
    {"`<br />`s"}
  </text>
);

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-help-bubble-root`}>
      <HStack width="full" height="320px" gap="x16" align="center" justify="center">
        <HelpBubbleAnchor open title={explicitLineBreakTitle}>
          <IconSparkle2 />
        </HelpBubbleAnchor>
        <HelpBubbleAnchor open title={"Breaking\nlines\nusing\nnewlines"}>
          <IconSparkle2 />
        </HelpBubbleAnchor>
      </HStack>
    </view>
  );
}
