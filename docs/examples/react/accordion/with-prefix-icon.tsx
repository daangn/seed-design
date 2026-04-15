import { IconCalendarFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionTitle,
  AccordionContent,
} from "seed-design/ui/accordion";

export default function AccordionWithPrefixIcon() {
  return (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger prefix={<Icon svg={<IconCalendarFill />} />}>
          <AccordionTitle>아코디언 항목 1</AccordionTitle>
        </AccordionTrigger>
        <AccordionContent>
          <p>첫 번째 항목의 내용입니다.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger prefix={<Icon svg={<IconCalendarFill />} />}>
          <AccordionTitle>아코디언 항목 2</AccordionTitle>
        </AccordionTrigger>
        <AccordionContent>
          <p>두 번째 항목의 내용입니다.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger prefix={<Icon svg={<IconCalendarFill />} />}>
          <AccordionTitle>아코디언 항목 3</AccordionTitle>
        </AccordionTrigger>
        <AccordionContent>
          <p>세 번째 항목의 내용입니다.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
