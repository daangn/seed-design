import { ActionButton } from "seed-design/ui/action-button";
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
        <ActionButton>열기</ActionButton>
      </HelpBubbleAnchor>
      <HelpBubbleAnchor open title={"Breaking\nlines\nusing\nnewlines"}>
        <ActionButton>열기</ActionButton>
      </HelpBubbleAnchor>
    </HStack>
  );
}
