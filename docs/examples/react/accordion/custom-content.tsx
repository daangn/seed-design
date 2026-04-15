import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionTitle,
  AccordionContent,
  AccordionDescription,
} from "seed-design/ui/accordion";

export default function AccordionCustomContent() {
  return (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <AccordionTitle>배송 안내</AccordionTitle>
          <AccordionDescription>배송 정책 및 예상 소요 시간</AccordionDescription>
        </AccordionTrigger>
        <AccordionContent>
          <div
            style={{
              margin: "0 16px 16px",
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: "var(--seed-color-bg-layer-default-hover)",
            }}
          >
            <p style={{ marginBottom: "8px", fontWeight: 600 }}>일반 배송</p>
            <p>주문 후 영업일 기준 2-3일 내에 배송됩니다.</p>
            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "var(--seed-color-bg-layer-default)",
              }}
            >
              <p style={{ fontSize: "13px", color: "var(--seed-color-fg-neutral-subtle)" }}>
                제주 및 도서산간 지역은 1-2일이 추가 소요될 수 있습니다.
              </p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          <AccordionTitle>반품 및 교환</AccordionTitle>
          <AccordionDescription>반품/교환 절차 안내</AccordionDescription>
        </AccordionTrigger>
        <AccordionContent>
          <ul
            style={{
              margin: "0 16px 16px",
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: "var(--seed-color-bg-layer-default-hover)",
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <li>1. 고객센터로 반품/교환 요청</li>
            <li>2. 상품 수거 (택배 방문 수거)</li>
            <li>3. 검수 후 환불 또는 교환 처리</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
