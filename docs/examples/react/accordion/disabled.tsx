import { Box } from "@seed-design/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "seed-design/ui/accordion";

export default function AccordionDisabled() {
  return (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger title="활성화된 항목" />
        <AccordionContent>
          <Box p="x4">
            <p>이 항목은 활성화 상태입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger title="비활성화된 항목" />
        <AccordionContent>
          <Box p="x4">
            <p>이 항목은 비활성화 상태입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger title="활성화된 항목" />
        <AccordionContent>
          <Box p="x4">
            <p>이 항목은 활성화 상태입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
