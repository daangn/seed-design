import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";

import {
  AppBar,
  AppBarLeft,
  AppBarMain,
  AppBarBackButton,
  AppBarIconButton,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import { HelpBubbleTrigger, HelpBubbleTriggerPortal } from "seed-design/ui/help-bubble";

declare module "@stackflow/config" {
  interface Register {
    ActivityHelpBubble: {};
  }
}

const ActivityHelpBubble: StaticActivityComponentType<"ActivityHelpBubble"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Help Bubble</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "center" }}>
          <HelpBubbleTrigger title="Flip 테스트">
            <ActionButton>Flip 테스트</ActionButton>
          </HelpBubbleTrigger>
        </div>
        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "center" }}>
          <HelpBubbleTrigger flip={false} title="Flip off 테스트">
            <ActionButton>Flip off 테스트</ActionButton>
          </HelpBubbleTrigger>
        </div>
        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "flex-end" }}>
          <HelpBubbleTrigger
            title="Slide 테스트"
            description={"어흥어흥어흥어흥어흥 야옹야옹야옹야옹야옹야옹"}
            contentProps={{ maxWidth: "200px" }}
          >
            <ActionButton>Slide 테스트</ActionButton>
          </HelpBubbleTrigger>
        </div>
        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "center" }}>
          <HelpBubbleTrigger
            title="Close Button 테스트"
            description={"어흥어흥어흥어흥어흥 야옹야옹야옹야옹야옹야옹"}
            showCloseButton
            contentProps={{ maxWidth: "200px" }}
          >
            <ActionButton>Close Button 테스트</ActionButton>
          </HelpBubbleTrigger>
        </div>
        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "center" }}>
          <HelpBubbleTrigger title="Placement=bottom 테스트" placement="bottom">
            <ActionButton>Placement=bottom 테스트</ActionButton>
          </HelpBubbleTrigger>
        </div>
        <div
          style={{
            display: "flex",
            paddingTop: "20vh",
            justifyContent: "center",
            background: "#ffeeee",
          }}
        >
          <HelpBubbleTriggerPortal
            title="Portal Positioner 테스트"
            description="이 버블이 열릴 때 전체 뷰포트가 스크롤되는 문제가 발생합니다"
            defaultOpen
          >
            <ActionButton variant="criticalSolid">Portal 테스트 (문제 재현)</ActionButton>
          </HelpBubbleTriggerPortal>
        </div>
        <div style={{ height: "100vh" }} />
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityHelpBubble;
