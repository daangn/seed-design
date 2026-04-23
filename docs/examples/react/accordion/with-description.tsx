import { Box } from "@seed-design/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "seed-design/ui/accordion";

export default function AccordionWithDescription() {
  return (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger title="아코디언 항목 1" description="항목에 대한 간략한 설명입니다." />
        <AccordionContent>
          <Box p="x4">
            <p>첫 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger title="아코디언 항목 2" description="항목에 대한 간략한 설명입니다." />
        <AccordionContent>
          <Box p="x4">
            <p>두 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger title="아코디언 항목 3" description="항목에 대한 간략한 설명입니다." />
        <AccordionContent>
          <Box p="x4">
            <p>세 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
