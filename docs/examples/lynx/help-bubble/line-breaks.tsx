import IconSparkle2 from "@karrotmarket/lynx-multicolor-icon/IconSparkle2";

import { HStack } from "@seed-design/lynx-react";
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
  return (
    <HStack gap="x16" align="center">
      <HelpBubbleAnchor open title={explicitLineBreakTitle}>
        <IconSparkle2 />
      </HelpBubbleAnchor>
      <HelpBubbleAnchor open title={"Breaking\nlines\nusing\nnewlines"}>
        <IconSparkle2 />
      </HelpBubbleAnchor>
    </HStack>
  );
}
