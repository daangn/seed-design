import { Box, Text } from "@seed-design/lynx-react";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../seed-design/ui/accordion";

function Content({ children }: { children: string }) {
  return (
    <Box p="x4">
      <Text textStyle="t4Regular">{children}</Text>
    </Box>
  );
}

export function AccordionPage() {
  return (
    <CatalogExamples title="Accordion" gap="16px">
      <CatalogSectionTitle>Inline</CatalogSectionTitle>
      <Accordion defaultValues={["first"]}>
        <AccordionItem value="first">
          <AccordionTrigger title="배송 안내" description="배송 방식과 예상 소요 시간" />
          <AccordionContent>
            <Content>주문 후 영업일 기준 2-3일 내에 배송됩니다.</Content>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="second">
          <AccordionTrigger title="반품 및 교환" />
          <AccordionContent>
            <Content>상품 수령 후 7일 이내에 신청할 수 있습니다.</Content>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <CatalogSectionTitle>Separated and Multiple</CatalogSectionTitle>
      <Accordion multiple defaultValues={["first", "second"]} variant="separated" size="large">
        <AccordionItem value="first">
          <AccordionTrigger title="첫 번째 항목" />
          <AccordionContent>
            <Content>여러 항목을 동시에 펼칠 수 있습니다.</Content>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="second">
          <AccordionTrigger title="두 번째 항목" />
          <AccordionContent>
            <Content>각 항목은 독립적으로 열고 닫힙니다.</Content>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <CatalogSectionTitle>Disabled</CatalogSectionTitle>
      <Accordion>
        <AccordionItem value="enabled">
          <AccordionTrigger title="활성화된 항목" />
          <AccordionContent>
            <Content>이 항목은 열 수 있습니다.</Content>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="disabled" disabled>
          <AccordionTrigger title="비활성화된 항목" />
          <AccordionContent>
            <Content>이 항목은 열 수 없습니다.</Content>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CatalogExamples>
  );
}
