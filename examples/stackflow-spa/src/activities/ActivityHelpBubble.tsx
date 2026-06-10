import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { useState, type ReactNode } from "react";

import { HelpBubble as SeedHelpBubble } from "@seed-design/react";
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
import { HelpBubbleTrigger } from "seed-design/ui/help-bubble";
import { Slider } from "seed-design/ui/slider";

declare module "@stackflow/config" {
  interface Register {
    ActivityHelpBubble: {};
  }
}

const LONG_DESCRIPTION =
  "당근은 동네 이웃과 따뜻한 거래를 나누는 공간이에요. 중고 거래부터 동네 가게, 알바, 부동산까지 우리 동네의 다양한 소식을 만나보세요. 이 도움말은 컨텐츠가 길 때 말풍선이 세로로 얼마나 늘어나는지 확인하기 위한 예시예요. 가로 너비는 size 미들웨어가 제한하지만, 세로 넘침은 flip과 shift가 처리합니다.";

const PORTAL_DESCRIPTION =
  "Positioner 대신 PositionerPortal로 렌더링돼 document.body 아래로 빠져나가요. size 미들웨어가 가로 너비를 제한해서 화면을 벗어나지 않습니다.";

interface PortalHelpBubbleTriggerProps extends Omit<SeedHelpBubble.RootProps, "children"> {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

function PortalHelpBubbleTrigger({
  title,
  description,
  children,
  ...otherProps
}: PortalHelpBubbleTriggerProps) {
  return (
    <SeedHelpBubble.Root {...otherProps}>
      <SeedHelpBubble.Trigger asChild>{children}</SeedHelpBubble.Trigger>
      <SeedHelpBubble.PositionerPortal>
        <SeedHelpBubble.Content>
          <SeedHelpBubble.Arrow>
            <SeedHelpBubble.ArrowTip />
          </SeedHelpBubble.Arrow>
          <SeedHelpBubble.Title>{title}</SeedHelpBubble.Title>
          {description && <SeedHelpBubble.Description>{description}</SeedHelpBubble.Description>}
        </SeedHelpBubble.Content>
      </SeedHelpBubble.PositionerPortal>
    </SeedHelpBubble.Root>
  );
}

const ActivityHelpBubble: StaticActivityComponentType<"ActivityHelpBubble"> = () => {
  const { push } = useFlow();
  const [triggerWidth, setTriggerWidth] = useState(40);

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
          >
            <ActionButton>Slide 테스트</ActionButton>
          </HelpBubbleTrigger>
        </div>
        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "center" }}>
          <HelpBubbleTrigger
            title="Close Button 테스트"
            description={"어흥어흥어흥어흥어흥 야옹야옹야옹야옹야옹야옹"}
            showCloseButton
          >
            <ActionButton>Close Button 테스트</ActionButton>
          </HelpBubbleTrigger>
        </div>
        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "center" }}>
          <HelpBubbleTrigger title="Placement=bottom 테스트" placement="bottom">
            <ActionButton>Placement=bottom 테스트</ActionButton>
          </HelpBubbleTrigger>
        </div>
        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "flex-start" }}>
          <HelpBubbleTrigger
            title="Placement=right 테스트"
            description={"어흥어흥어흥어흥어흥 야옹야옹야옹야옹야옹야옹"}
            placement="right"
          >
            <ActionButton>Placement=right 테스트</ActionButton>
          </HelpBubbleTrigger>
        </div>
        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "flex-end" }}>
          <HelpBubbleTrigger
            title="Placement=left 테스트"
            description={"어흥어흥어흥어흥어흥 야옹야옹야옹야옹야옹야옹"}
            placement="left"
          >
            <ActionButton>Placement=left 테스트</ActionButton>
          </HelpBubbleTrigger>
        </div>
        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "flex-start" }}>
          <HelpBubbleTrigger title="Placement=right-start 테스트" placement="right-start">
            <ActionButton>Placement=right-start 테스트</ActionButton>
          </HelpBubbleTrigger>
        </div>
        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "flex-end" }}>
          <HelpBubbleTrigger title="Placement=left-end 테스트" placement="left-end">
            <ActionButton>Placement=left-end 테스트</ActionButton>
          </HelpBubbleTrigger>
        </div>
        <div style={{ paddingTop: "20vh", paddingLeft: "16px", paddingRight: "16px" }}>
          <Slider
            label="Trigger 너비"
            indicator={`${triggerWidth}%`}
            min={20}
            max={100}
            step={1}
            values={[triggerWidth]}
            onValuesChange={(values) => setTriggerWidth(values[0])}
            getAriaLabel={() => "trigger width"}
          />
          <div style={{ display: "flex", justifyContent: "flex-start", paddingTop: "16px" }}>
            <HelpBubbleTrigger
              title="Width 조절 테스트"
              description={
                "trigger를 넓혀 좌우 공간이 없어지면 flip 배열을 따라 top/bottom으로 폴백돼요. 말풍선을 열어둔 채 슬라이더를 움직여 보세요."
              }
              placement="right"
              flip={["right", "left", "top", "bottom"]}
              closeOnInteractOutside={false}
            >
              <ActionButton style={{ width: `${triggerWidth}%` }}>
                너비 {triggerWidth}%
              </ActionButton>
            </HelpBubbleTrigger>
          </div>
        </div>
        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "center" }}>
          <HelpBubbleTrigger
            title="긴 컨텐츠 (placement=top)"
            description={LONG_DESCRIPTION}
            placement="top"
          >
            <ActionButton>긴 컨텐츠 top 테스트</ActionButton>
          </HelpBubbleTrigger>
        </div>
        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "center" }}>
          <HelpBubbleTrigger
            title="긴 컨텐츠 (placement=bottom)"
            description={LONG_DESCRIPTION}
            placement="bottom"
          >
            <ActionButton>긴 컨텐츠 bottom 테스트</ActionButton>
          </HelpBubbleTrigger>
        </div>
        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "center" }}>
          <PortalHelpBubbleTrigger
            title="Portal placement=top"
            description={PORTAL_DESCRIPTION}
            placement="top"
          >
            <ActionButton>Portal (top)</ActionButton>
          </PortalHelpBubbleTrigger>
        </div>
        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "center" }}>
          <PortalHelpBubbleTrigger
            title="Portal placement=bottom"
            description={PORTAL_DESCRIPTION}
            placement="bottom"
          >
            <ActionButton>Portal (bottom)</ActionButton>
          </PortalHelpBubbleTrigger>
        </div>
        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "flex-end" }}>
          <PortalHelpBubbleTrigger
            title="Portal placement=left"
            description={PORTAL_DESCRIPTION}
            placement="left"
          >
            <ActionButton>Portal (left)</ActionButton>
          </PortalHelpBubbleTrigger>
        </div>
        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "flex-start" }}>
          <PortalHelpBubbleTrigger
            title="Portal placement=right"
            description={PORTAL_DESCRIPTION}
            placement="right"
          >
            <ActionButton>Portal (right)</ActionButton>
          </PortalHelpBubbleTrigger>
        </div>
        <div style={{ height: "100vh" }} />
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityHelpBubble;
