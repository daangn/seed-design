import "./styles";

import { Box, Text, VStack } from "@seed-design/lynx-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Example() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
      <Accordion size="medium" style={{ width: "100%" }}>
        <AccordionItem value="item-1">
          <AccordionTrigger title="아코디언 항목" description="size=medium (default)" />
          <AccordionContent>
            <Box p="x4">
              <Text textStyle="t4Regular">항목의 내용입니다.</Text>
            </Box>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion size="large" style={{ width: "100%" }}>
        <AccordionItem value="item-1">
          <AccordionTrigger title="아코디언 항목" description="size=large" />
          <AccordionContent>
            <Box p="x4">
              <Text textStyle="t4Regular">항목의 내용입니다.</Text>
            </Box>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
}
