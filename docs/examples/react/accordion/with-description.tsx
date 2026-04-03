import { Accordion } from "seed-design/ui/accordion";

export default function AccordionWithDescription() {
  return (
    <Accordion>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>
          <Accordion.Title>아코디언 항목 1</Accordion.Title>
          <Accordion.Description>항목에 대한 간략한 설명입니다.</Accordion.Description>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>첫 번째 항목의 내용입니다.</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>
          <Accordion.Title>아코디언 항목 2</Accordion.Title>
          <Accordion.Description>항목에 대한 간략한 설명입니다.</Accordion.Description>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>두 번째 항목의 내용입니다.</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger>
          <Accordion.Title>아코디언 항목 3</Accordion.Title>
          <Accordion.Description>항목에 대한 간략한 설명입니다.</Accordion.Description>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>세 번째 항목의 내용입니다.</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}
