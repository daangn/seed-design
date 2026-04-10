import { Accordion } from "seed-design/ui/accordion";

export default function AccordionInline() {
  return (
    <Accordion variant="inline">
      <Accordion.Item value="item-1">
        <Accordion.Trigger>
          <Accordion.Body>
            <Accordion.Title>아코디언 항목 1</Accordion.Title>
          </Accordion.Body>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>첫 번째 항목의 내용입니다.</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>
          <Accordion.Body>
            <Accordion.Title>아코디언 항목 2</Accordion.Title>
          </Accordion.Body>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>두 번째 항목의 내용입니다.</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger>
          <Accordion.Body>
            <Accordion.Title>아코디언 항목 3</Accordion.Title>
          </Accordion.Body>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>세 번째 항목의 내용입니다.</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}
