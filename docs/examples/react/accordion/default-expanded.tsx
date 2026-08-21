import { Box } from "@seed-design/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "seed-design/ui/accordion";

export default function AccordionDefaultExpanded() {
  return (
    <Accordion multiple defaultValues={["item-1"]}>
      <AccordionItem value="item-1">
        <AccordionTrigger title="아코디언 항목 1" />
        <AccordionContent>
          <Box p="x4">
            <p>첫 번째 항목은 기본으로 펼쳐진 상태입니다.</p>
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
