import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionTitle,
  AccordionContent,
  AccordionDescription,
} from "seed-design/ui/accordion";

export default function AccordionWithDescription() {
  return (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <AccordionTitle>아코디언 항목 1</AccordionTitle>
          <AccordionDescription>항목에 대한 간략한 설명입니다.</AccordionDescription>
        </AccordionTrigger>
        <AccordionContent>
          <p>첫 번째 항목의 내용입니다.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          <AccordionTitle>아코디언 항목 2</AccordionTitle>
          <AccordionDescription>항목에 대한 간략한 설명입니다.</AccordionDescription>
        </AccordionTrigger>
        <AccordionContent>
          <p>두 번째 항목의 내용입니다.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          <AccordionTitle>아코디언 항목 3</AccordionTitle>
          <AccordionDescription>항목에 대한 간략한 설명입니다.</AccordionDescription>
        </AccordionTrigger>
        <AccordionContent>
          <p>세 번째 항목의 내용입니다.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
