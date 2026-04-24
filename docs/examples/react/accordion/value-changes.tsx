import { Box, Text, VStack } from "@seed-design/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "seed-design/ui/accordion";
import { useState } from "react";

const DEFAULT_VALUES = ["shipping"];

export default function AccordionValueChanges() {
  const [values, setValues] = useState<string[]>(DEFAULT_VALUES);
  const [history, setHistory] = useState<string[][]>([DEFAULT_VALUES]);

  return (
    <Box
      width="full"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 360px)",
        gap: "24px",
        alignItems: "start",
      }}
    >
      <Accordion
        type="multiple"
        values={values}
        onValuesChange={(nextValues) => {
          setValues(nextValues);
          setHistory((prev) => [nextValues, ...prev].slice(0, 5));
        }}
      >
        <AccordionItem value="shipping">
          <AccordionTrigger title="배송 옵션" />
          <AccordionContent>
            <Box p="x4">
              <p>빠른 배송, 새벽 배송, 방문 수령 옵션을 비교할 수 있습니다.</p>
            </Box>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="payment">
          <AccordionTrigger title="결제 수단" />
          <AccordionContent>
            <Box p="x4">
              <p>카드, 계좌이체, 간편결제 중에서 원하는 결제 수단을 선택할 수 있습니다.</p>
            </Box>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="refund">
          <AccordionTrigger title="환불 정책" />
          <AccordionContent>
            <Box p="x4">
              <p>주문 취소 가능 시간과 환불 소요 기간을 확인할 수 있습니다.</p>
            </Box>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Box
        p="x4"
        bg="bg.layerBasement"
        borderRadius="r2"
        borderWidth={1}
        borderColor="stroke.neutralWeak"
        style={{ alignSelf: "start" }}
      >
        <VStack gap="x2" align="stretch">
          <Text textStyle="t3Medium">
            <code>values</code>: {JSON.stringify(values)}
          </Text>
          <Text textStyle="t3Medium">
            <code>onValuesChange</code> history:
          </Text>
          {history.map((snapshot, index) => (
            <Text key={`${snapshot.join(",") || "empty"}-${index}`} textStyle="t4Regular">
              {index + 1}. {JSON.stringify(snapshot)}
            </Text>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
