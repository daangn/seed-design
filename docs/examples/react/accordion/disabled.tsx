import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionTitle,
  AccordionContent,
} from "seed-design/ui/accordion";

export default function AccordionDisabled() {
  return (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <AccordionTitle>활성화된 항목</AccordionTitle>
        </AccordionTrigger>
        <AccordionContent>
          <p>이 항목은 활성화 상태입니다.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>
          <AccordionTitle>비활성화된 항목</AccordionTitle>
        </AccordionTrigger>
        <AccordionContent>
          <p>이 항목은 비활성화 상태입니다.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          <AccordionTitle>활성화된 항목</AccordionTitle>
        </AccordionTrigger>
        <AccordionContent>
          <p>이 항목은 활성화 상태입니다.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
