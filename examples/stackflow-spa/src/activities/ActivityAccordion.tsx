import type { StaticActivityComponentType } from "@stackflow/react/future";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { useFlow } from "@stackflow/react/future";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "seed-design/ui/accordion";

declare module "@stackflow/config" {
  interface Register {
    ActivityAccordion: {};
  }
}

const ActivityAccordion: StaticActivityComponentType<"ActivityAccordion"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Accordion</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <div style={{ padding: "16px" }}>
          <p style={{ marginBottom: "16px", fontSize: "14px", fontWeight: 600 }}>Inline</p>
          <Accordion variant="inline">
            <AccordionItem value="item-1">
              <AccordionTrigger title="당근마켓은 어떤 서비스인가요?" />
              <AccordionContent>
                당근마켓은 동네 이웃 간의 중고거래를 돕는 플랫폼입니다. 가까운 이웃과 직거래로
                안전하게 거래할 수 있어요.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger
                title="안전하게 거래하는 방법이 있나요?"
                description="직거래 안전 가이드"
              />
              <AccordionContent>
                공공장소에서 만나거나 안전거래 서비스를 이용해 보세요. 상품을 직접 확인하고 거래하는
                것을 권장합니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger title="매너온도는 무엇인가요?" />
              <AccordionContent>
                매너온도는 당근마켓 회원들의 거래 매너를 수치화한 지표입니다. 좋은 거래 경험을
                쌓을수록 온도가 올라갑니다.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div style={{ padding: "16px" }}>
          <p style={{ marginBottom: "16px", fontSize: "14px", fontWeight: 600 }}>Separated</p>
          <Accordion variant="separated" type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger title="당근마켓은 어떤 서비스인가요?" />
              <AccordionContent>
                당근마켓은 동네 이웃 간의 중고거래를 돕는 플랫폼입니다. 가까운 이웃과 직거래로
                안전하게 거래할 수 있어요.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger
                title="안전하게 거래하는 방법이 있나요?"
                description="직거래 안전 가이드"
              />
              <AccordionContent>
                공공장소에서 만나거나 안전거래 서비스를 이용해 보세요. 상품을 직접 확인하고 거래하는
                것을 권장합니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger title="매너온도는 무엇인가요?" />
              <AccordionContent>
                매너온도는 당근마켓 회원들의 거래 매너를 수치화한 지표입니다. 좋은 거래 경험을
                쌓을수록 온도가 올라갑니다.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityAccordion;
