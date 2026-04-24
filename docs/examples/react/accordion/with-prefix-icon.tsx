import { Box, Icon } from "@seed-design/react";
import {
  IconCardLine,
  IconQuestionmarkCircleLine,
  IconTruckLine,
} from "@karrotmarket/react-monochrome-icon";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "seed-design/ui/accordion";

export default function AccordionWithPrefixIcon() {
  return (
    <Accordion>
      <AccordionItem value="shipping">
        <AccordionTrigger prefix={<Icon svg={<IconTruckLine />} />} title="배송 방법" />
        <AccordionContent>
          <Box p="x4">
            <p>일반 배송, 빠른 배송, 방문 수령 중 주문 상황에 맞는 방법을 선택할 수 있습니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="payment">
        <AccordionTrigger prefix={<Icon svg={<IconCardLine />} />} title="결제 및 쿠폰" />
        <AccordionContent>
          <Box p="x4">
            <p>카드, 간편결제, 보유 쿠폰을 한 번에 확인하고 결제에 적용할 수 있습니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="support">
        <AccordionTrigger prefix={<Icon svg={<IconQuestionmarkCircleLine />} />} title="문의와 환불" />
        <AccordionContent>
          <Box p="x4">
            <p>주문 취소 가능 시간, 환불 소요 기간, 고객센터 문의 방법을 확인할 수 있습니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
