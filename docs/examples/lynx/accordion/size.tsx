import "./styles";

import { root } from "@lynx-js/react";
import { Box, Text, VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack width="full" gap="spacingY.componentDefault">
        <Accordion size="medium">
          <AccordionItem value="item-1">
            <AccordionTrigger title="아코디언 항목" description="size=medium (default)" />
            <AccordionContent>
              <Box p="x4">
                <Text textStyle="t4Regular">항목의 내용입니다.</Text>
              </Box>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion size="large">
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
    </page>
  );
}

root.render(<Root />);
