import "./styles";

import { root, useState } from "@lynx-js/react";
import { Box, Text, useSeedClassName } from "@seed-design/lynx-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [values, setValues] = useState<string[]>(["item-1"]);

  function handleValuesChange(nextValues: string[]) {
    "background only";

    if (nextValues.length === 0) return;
    setValues(nextValues);
  }

  return (
    <page className={seedClassName}>
      <Accordion values={values} onValuesChange={handleValuesChange}>
        <AccordionItem value="item-1">
          <AccordionTrigger title="주문 전 확인 사항" />
          <AccordionContent>
            <Box p="x4">
              <Text textStyle="t4Regular">
                현재 항목은 다시 눌러도 닫히지 않고, 다른 항목을 선택할 때만 전환됩니다.
              </Text>
            </Box>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger title="배송 일정" />
          <AccordionContent>
            <Box p="x4">
              <Text textStyle="t4Regular">
                평일 오후 2시 이전 주문은 당일 출고되며, 주말 주문은 다음 영업일에 출고됩니다.
              </Text>
            </Box>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger title="교환 및 반품" />
          <AccordionContent>
            <Box p="x4">
              <Text textStyle="t4Regular">
                수령 후 7일 이내에 교환 또는 반품을 요청할 수 있습니다.
              </Text>
            </Box>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </page>
  );
}

root.render(<Root />);
