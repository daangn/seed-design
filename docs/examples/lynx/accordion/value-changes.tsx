import "./styles";

import { root, useState } from "@lynx-js/react";
import { Box, Text, useSeedClassName } from "@seed-design/lynx-react";
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

  return (
    <page className={seedClassName}>
      <Accordion multiple values={values} onValuesChange={setValues} variant="separated">
        <AccordionItem value="shipping">
          <AccordionTrigger title="배송 옵션" description="배송 방식과 예상 소요 시간" />
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
              <Text textStyle="t4Regular">원하는 결제 수단을 확인할 수 있습니다.</Text>
            </Box>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <text className="accordion-preview__status">values: {JSON.stringify(values)}</text>
    </page>
  );
}

root.render(<Root />);
