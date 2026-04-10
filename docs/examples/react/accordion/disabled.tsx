import { Accordion } from "seed-design/ui/accordion";

export default function AccordionDisabled() {
  return (
    <Accordion>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>
          <Accordion.Body>
            <Accordion.Title>활성화된 항목</Accordion.Title>
          </Accordion.Body>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>이 항목은 활성화 상태입니다.</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2" disabled>
        <Accordion.Trigger>
          <Accordion.Body>
            <Accordion.Title>비활성화된 항목</Accordion.Title>
          </Accordion.Body>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>이 항목은 비활성화 상태입니다.</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger>
          <Accordion.Body>
            <Accordion.Title>활성화된 항목</Accordion.Title>
          </Accordion.Body>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>이 항목은 활성화 상태입니다.</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}
