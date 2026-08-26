import "./styles";

import { root } from "@lynx-js/react";
import { Box, Text, useSeedClassName } from "@seed-design/lynx-react";
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
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger title="활성화된 항목" />
          <AccordionContent>
            <Box p="x4">
              <Text textStyle="t4Regular">이 항목은 활성화 상태입니다.</Text>
            </Box>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" disabled>
          <AccordionTrigger title="비활성화된 항목" />
          <AccordionContent>
            <Box p="x4">
              <Text textStyle="t4Regular">이 항목은 열 수 없습니다.</Text>
            </Box>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger title="활성화된 항목" />
          <AccordionContent>
            <Box p="x4">
              <Text textStyle="t4Regular">이 항목은 활성화 상태입니다.</Text>
            </Box>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </page>
  );
}

root.render(<Root />);
