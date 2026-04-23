import { Box } from "@seed-design/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "seed-design/ui/accordion";

export default function AccordionCollapsible() {
  return (
    <Accordion type="single" defaultValues={["item-1"]} collapsible={false}>
      <AccordionItem value="item-1">
        <AccordionTrigger title="주문 전 확인 사항" />
        <AccordionContent>
          <Box p="x4">
            <p>현재 항목은 다시 눌러도 닫히지 않고, 다른 항목을 선택할 때만 전환됩니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger title="배송 일정" />
        <AccordionContent>
          <Box p="x4">
            <p>평일 오후 2시 이전 주문은 당일 출고되며, 주말 주문은 다음 영업일에 출고됩니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger title="교환 및 반품" />
        <AccordionContent>
          <Box p="x4">
            <p>수령 후 7일 이내에 교환 또는 반품을 요청할 수 있습니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
