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
import { Accordion } from "seed-design/ui/accordion";

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
            <Accordion.Item value="item-1">
              <Accordion.Trigger>
                <Accordion.Title>당근마켓은 어떤 서비스인가요?</Accordion.Title>
              </Accordion.Trigger>
              <Accordion.Content>
                당근마켓은 동네 이웃 간의 중고거래를 돕는 플랫폼입니다. 가까운 이웃과 직거래로
                안전하게 거래할 수 있어요.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="item-2">
              <Accordion.Trigger>
                <Accordion.Title>안전하게 거래하는 방법이 있나요?</Accordion.Title>
                <Accordion.Description>직거래 안전 가이드</Accordion.Description>
              </Accordion.Trigger>
              <Accordion.Content>
                공공장소에서 만나거나 안전거래 서비스를 이용해 보세요. 상품을 직접 확인하고 거래하는
                것을 권장합니다.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="item-3">
              <Accordion.Trigger>
                <Accordion.Title>매너온도는 무엇인가요?</Accordion.Title>
              </Accordion.Trigger>
              <Accordion.Content>
                매너온도는 당근마켓 회원들의 거래 매너를 수치화한 지표입니다. 좋은 거래 경험을
                쌓을수록 온도가 올라갑니다.
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </div>

        <div style={{ padding: "16px" }}>
          <p style={{ marginBottom: "16px", fontSize: "14px", fontWeight: 600 }}>Separated</p>
          <Accordion variant="separated" type="single" collapsible>
            <Accordion.Item value="item-1">
              <Accordion.Trigger>
                <Accordion.Title>당근마켓은 어떤 서비스인가요?</Accordion.Title>
              </Accordion.Trigger>
              <Accordion.Content>
                당근마켓은 동네 이웃 간의 중고거래를 돕는 플랫폼입니다. 가까운 이웃과 직거래로
                안전하게 거래할 수 있어요.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="item-2">
              <Accordion.Trigger>
                <Accordion.Title>안전하게 거래하는 방법이 있나요?</Accordion.Title>
                <Accordion.Description>직거래 안전 가이드</Accordion.Description>
              </Accordion.Trigger>
              <Accordion.Content>
                공공장소에서 만나거나 안전거래 서비스를 이용해 보세요. 상품을 직접 확인하고 거래하는
                것을 권장합니다.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="item-3">
              <Accordion.Trigger>
                <Accordion.Title>매너온도는 무엇인가요?</Accordion.Title>
              </Accordion.Trigger>
              <Accordion.Content>
                매너온도는 당근마켓 회원들의 거래 매너를 수치화한 지표입니다. 좋은 거래 경험을
                쌓을수록 온도가 올라갑니다.
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </div>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityAccordion;
