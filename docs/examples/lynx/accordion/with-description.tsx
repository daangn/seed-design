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
          <AccordionTrigger title="아코디언 항목 1" description="항목에 대한 간략한 설명입니다." />
          <AccordionContent>
            <Box p="x4">
              <Text textStyle="t4Regular">첫 번째 항목의 내용입니다.</Text>
            </Box>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger title="아코디언 항목 2" description="항목에 대한 간략한 설명입니다." />
          <AccordionContent>
            <Box p="x4">
              <Text textStyle="t4Regular">두 번째 항목의 내용입니다.</Text>
            </Box>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger title="아코디언 항목 3" description="항목에 대한 간략한 설명입니다." />
          <AccordionContent>
            <Box p="x4">
              <Text textStyle="t4Regular">세 번째 항목의 내용입니다.</Text>
            </Box>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </page>
  );
}

root.render(<Root />);
