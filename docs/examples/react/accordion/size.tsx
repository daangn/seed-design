import { Box, VStack } from "@seed-design/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "seed-design/ui/accordion";

export default function AccordionSize() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
      <Accordion size="medium">
        <AccordionItem value="item-1">
          <AccordionTrigger title="아코디언 항목" description="size=medium (default)" />
          <AccordionContent>
            <Box p="x4">항목의 내용입니다.</Box>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion size="large">
        <AccordionItem value="item-1">
          <AccordionTrigger title="아코디언 항목" description="size=large" />
          <AccordionContent>
            <Box p="x4">항목의 내용입니다.</Box>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion size="responsive">
        <AccordionItem value="item-1">
          <AccordionTrigger title="아코디언 항목" description="size=responsive" />
          <AccordionContent>
            <Box p="x4">항목의 내용입니다.</Box>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
}
