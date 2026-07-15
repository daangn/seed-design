"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Box } from "@seed-design/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  type AccordionProps,
  AccordionTrigger,
} from "seed-design/ui/accordion";

function AccordionPreview(
  props: Pick<AccordionProps, "variant" | "size" | "multiple" | "disabled">,
) {
  return (
    <Accordion {...props}>
      <AccordionItem value="item-1">
        <AccordionTrigger title="아코디언 항목 1" />
        <AccordionContent>
          <Box p="x4">
            <p>첫 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger title="아코디언 항목 2" />
        <AccordionContent>
          <Box p="x4">
            <p>두 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger title="아코디언 항목 3" />
        <AccordionContent>
          <Box p="x4">
            <p>세 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export const story = defineStory({
  displayName: "Accordion",
  Component: withStoryPreview()(AccordionPreview),
  args: {
    initial: {
      variant: "inline",
      size: "medium",
      multiple: false,
      disabled: false,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
