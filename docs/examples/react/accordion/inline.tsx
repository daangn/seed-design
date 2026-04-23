import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "seed-design/ui/accordion";

export default function AccordionInline() {
  return (
    <Accordion variant="inline">
      <AccordionItem value="item-1">
        <AccordionTrigger title="아코디언 항목 1" />
        <AccordionContent>
          <p>첫 번째 항목의 내용입니다.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger title="아코디언 항목 2" />
        <AccordionContent>
          <p>두 번째 항목의 내용입니다.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger title="아코디언 항목 3" />
        <AccordionContent>
          <p>세 번째 항목의 내용입니다.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
