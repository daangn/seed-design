import { Box, Text, VStack } from "@seed-design/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "seed-design/ui/accordion";

export default function AccordionHeadingLevel() {
  return (
    <Box width="full" height="full" p="x6">
      <VStack gap="x4" align="stretch" width="full">
        <Text as="h3" textStyle="t5Bold">
          주문 도움말
        </Text>
        <Accordion>
          <AccordionItem value="shipping">
            <AccordionTrigger
              headingLevel={4}
              title="배송 일정"
              description="상위 섹션이 이미 h3인 경우"
            />
            <AccordionContent>
              <Box p="x4">
                <p>
                  배송 관련 세부 내용은 h4 heading 아래의 accordion section으로 제공할 수 있습니다.
                </p>
              </Box>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Box>
  );
}
