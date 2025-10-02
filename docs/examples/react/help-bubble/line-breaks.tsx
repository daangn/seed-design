import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleAnchor } from "seed-design/ui/help-bubble";
import { HStack } from "@seed-design/react";

export default function HelpBubbleLineBreaks() {
  return (
    <HStack gap="x16">
      <HelpBubbleAnchor
        open
        title={
          <>
            Breaking
            <br />
            lines
            <br />
            using
            <br />
            `&lt;br /&gt;`s
          </>
        }
      >
        <Icon svg={<IconSparkle2 />} />
      </HelpBubbleAnchor>
      <HelpBubbleAnchor open title={"Breaking\nlines\nusing\nnewlines"}>
        <Icon svg={<IconSparkle2 />} />
      </HelpBubbleAnchor>
    </HStack>
  );
}
