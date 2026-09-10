import "./styles";

import { Box, Text, useSeedClassName } from "@seed-design/lynx-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-accordion-root`}>
      <Accordion variant="inline">
        <AccordionItem value="item-1">
          <AccordionTrigger title="아코디언 항목 1" />
          <AccordionContent>
            <Box p="x4">
              <Text textStyle="t4Regular">첫 번째 항목의 내용입니다.</Text>
            </Box>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger title="아코디언 항목 2" />
          <AccordionContent>
            <Box p="x4">
              <Text textStyle="t4Regular">두 번째 항목의 내용입니다.</Text>
            </Box>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger title="아코디언 항목 3" />
          <AccordionContent>
            <Box p="x4">
              <Text textStyle="t4Regular">세 번째 항목의 내용입니다.</Text>
            </Box>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </view>
  );
}
