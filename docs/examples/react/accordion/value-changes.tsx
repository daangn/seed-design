import { Box, Text, VStack } from "@seed-design/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTitle,
  AccordionTrigger,
} from "seed-design/ui/accordion";
import { useState } from "react";

const DEFAULT_VALUE = ["shipping"];

export default function AccordionValueChanges() {
  const [value, setValue] = useState<string[]>(DEFAULT_VALUE);
  const [history, setHistory] = useState<string[][]>([DEFAULT_VALUE]);

  return (
    <VStack gap="x4" width="full" align="stretch">
      <Accordion
        type="multiple"
        value={value}
        onValueChange={(nextValue) => {
          setValue(nextValue);
          setHistory((prev) => [nextValue, ...prev].slice(0, 5));
        }}
      >
        <AccordionItem value="shipping">
          <AccordionTrigger>
            <AccordionTitle>배송 옵션</AccordionTitle>
          </AccordionTrigger>
          <AccordionContent>
            <p>빠른 배송, 새벽 배송, 방문 수령 옵션을 비교할 수 있습니다.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="payment">
          <AccordionTrigger>
            <AccordionTitle>결제 수단</AccordionTitle>
          </AccordionTrigger>
          <AccordionContent>
            <p>카드, 계좌이체, 간편결제 중에서 원하는 결제 수단을 선택할 수 있습니다.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="refund">
          <AccordionTrigger>
            <AccordionTitle>환불 정책</AccordionTitle>
          </AccordionTrigger>
          <AccordionContent>
            <p>주문 취소 가능 시간과 환불 소요 기간을 확인할 수 있습니다.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Box
        p="x4"
        bg="bg.layerBasement"
        borderRadius="r2"
        borderWidth={1}
        borderColor="stroke.neutralWeak"
      >
        <VStack gap="x2" align="stretch">
          <Text textStyle="t3Medium">
            <code>value</code>: {JSON.stringify(value)}
          </Text>
          <Text textStyle="t3Medium">
            <code>onValueChange</code> history:
          </Text>
          {history.map((snapshot, index) => (
            <Text key={`${snapshot.join(",") || "empty"}-${index}`} textStyle="t4Regular">
              {index + 1}. {JSON.stringify(snapshot)}
            </Text>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
}
