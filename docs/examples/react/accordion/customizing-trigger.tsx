import { Accordion } from "seed-design/ui/accordion";

export default function AccordionCustomizingTrigger() {
  return (
    <Accordion>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>
          <Accordion.Body>
            <Accordion.Title>공지사항</Accordion.Title>
          </Accordion.Body>
          <span
            style={{
              marginLeft: "8px",
              padding: "2px 6px",
              borderRadius: "9999px",
              backgroundColor: "#FF7E36",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 600,
              lineHeight: "16px",
            }}
          >
            3
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>새로운 공지사항이 3개 있습니다.</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>
          <Accordion.Body>
            <Accordion.Title>이벤트</Accordion.Title>
          </Accordion.Body>
          <span
            style={{
              marginLeft: "8px",
              padding: "2px 6px",
              borderRadius: "9999px",
              backgroundColor: "#FF7E36",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 600,
              lineHeight: "16px",
            }}
          >
            NEW
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>진행 중인 이벤트를 확인하세요.</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger>
          <Accordion.Body>
            <Accordion.Title>자주 묻는 질문</Accordion.Title>
          </Accordion.Body>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>자주 묻는 질문 목록입니다.</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}
