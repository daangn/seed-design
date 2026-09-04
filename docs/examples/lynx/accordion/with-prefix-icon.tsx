import "./styles";

import IconCardLine from "@karrotmarket/lynx-monochrome-icon/IconCardLine";
import IconQuestionmarkCircleLine from "@karrotmarket/lynx-monochrome-icon/IconQuestionmarkCircleLine";
import IconTruckLine from "@karrotmarket/lynx-monochrome-icon/IconTruckLine";
import { root } from "@lynx-js/react";
import { Box, Icon, Text, useSeedClassName } from "@seed-design/lynx-react";
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
        <AccordionItem value="shipping">
          <AccordionTrigger
            prefix={<Icon icon={<IconTruckLine />} size="full" />}
            title="배송 방법"
          />
          <AccordionContent>
            <Box p="x4">
              <Text textStyle="t4Regular">
                일반 배송, 빠른 배송, 방문 수령 중 주문 상황에 맞는 방법을 선택할 수 있습니다.
              </Text>
            </Box>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="payment">
          <AccordionTrigger
            prefix={<Icon icon={<IconCardLine />} size="full" />}
            title="결제 및 쿠폰"
          />
          <AccordionContent>
            <Box p="x4">
              <Text textStyle="t4Regular">
                카드, 간편결제, 보유 쿠폰을 한 번에 확인하고 결제에 적용할 수 있습니다.
              </Text>
            </Box>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="support">
          <AccordionTrigger
            prefix={<Icon icon={<IconQuestionmarkCircleLine />} size="full" />}
            title="문의와 환불"
          />
          <AccordionContent>
            <Box p="x4">
              <Text textStyle="t4Regular">
                주문 취소 가능 시간, 환불 소요 기간, 고객센터 문의 방법을 확인할 수 있습니다.
              </Text>
            </Box>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </page>
  );
}

root.render(<Root />);
