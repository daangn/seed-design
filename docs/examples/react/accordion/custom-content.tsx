import { Box, Text, VStack } from "@seed-design/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "seed-design/ui/accordion";

export default function AccordionCustomContent() {
  return (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger title="배송 안내" description="배송 정책 및 예상 소요 시간" />
        <AccordionContent>
          <Box p="x4">
            <Box p="x4" borderRadius="r3" bg="bg.layerBasement">
              <VStack gap="x3" align="stretch">
                <VStack gap="x1" align="stretch">
                  <Text textStyle="t5Bold">일반 배송</Text>
                  <Text textStyle="t5Regular">주문 후 영업일 기준 2-3일 내에 배송됩니다.</Text>
                </VStack>
                <Box p="x3" borderRadius="r2" bg="bg.layerDefault">
                  <Text textStyle="t4Regular" color="fg.neutralSubtle">
                    제주 및 도서산간 지역은 1-2일이 추가 소요될 수 있습니다.
                  </Text>
                </Box>
              </VStack>
            </Box>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger title="반품 및 교환" description="반품/교환 절차 안내" />
        <AccordionContent>
          <Box p="x4">
            <Box p="x4" borderRadius="r3" bg="bg.layerBasement">
              <VStack gap="x2" align="stretch">
                <Text textStyle="t5Regular">1. 고객센터로 반품/교환 요청</Text>
                <Text textStyle="t5Regular">2. 상품 수거 (택배 방문 수거)</Text>
                <Text textStyle="t5Regular">3. 검수 후 환불 또는 교환 처리</Text>
              </VStack>
            </Box>
          </Box>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
