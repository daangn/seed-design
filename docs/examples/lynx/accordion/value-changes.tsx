import "./styles";

import { root, useState } from "@lynx-js/react";
import { Box, HStack, Text, VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const DEFAULT_VALUES = ["shipping"];

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [values, setValues] = useState<string[]>(DEFAULT_VALUES);
  const [history, setHistory] = useState<string[][]>([DEFAULT_VALUES]);

  function handleValuesChange(nextValues: string[]) {
    "background only";

    setValues(nextValues);
    setHistory((previous) => [nextValues, ...previous].slice(0, 5));
  }

  return (
    <page className={seedClassName}>
      <HStack className="accordion-preview__value-changes" gap="x6" align="flexStart">
        <Box flexGrow width="full" minWidth="0">
          <Accordion multiple values={values} onValuesChange={handleValuesChange}>
            <AccordionItem value="shipping">
              <AccordionTrigger title="배송 옵션" />
              <AccordionContent>
                <Box p="x4">
                  <Text textStyle="t4Regular">
                    빠른 배송, 새벽 배송, 방문 수령 옵션을 비교할 수 있습니다.
                  </Text>
                </Box>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="payment">
              <AccordionTrigger title="결제 수단" />
              <AccordionContent>
                <Box p="x4">
                  <Text textStyle="t4Regular">
                    카드, 계좌이체, 간편결제 중에서 원하는 결제 수단을 선택할 수 있습니다.
                  </Text>
                </Box>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="refund">
              <AccordionTrigger title="환불 정책" />
              <AccordionContent>
                <Box p="x4">
                  <Text textStyle="t4Regular">
                    주문 취소 가능 시간과 환불 소요 기간을 확인할 수 있습니다.
                  </Text>
                </Box>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Box>

        <Box
          className="accordion-preview__history"
          p="x4"
          bg="bg.layerBasement"
          borderRadius="r2"
          borderWidth={1}
          borderColor="stroke.neutralWeak"
        >
          <VStack gap="x2" align="stretch">
            <Text textStyle="t3Medium">values: {JSON.stringify(values)}</Text>
            <Text textStyle="t3Medium">onValuesChange history:</Text>
            {history.map((snapshot, index) => (
              <Text key={`${snapshot.join(",") || "empty"}-${index}`} textStyle="t4Regular">
                {index + 1}. {JSON.stringify(snapshot)}
              </Text>
            ))}
          </VStack>
        </Box>
      </HStack>
    </page>
  );
}

root.render(<Root />);
