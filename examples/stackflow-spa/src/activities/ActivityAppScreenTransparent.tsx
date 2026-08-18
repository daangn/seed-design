import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { Flex } from "@seed-design/react";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import {
  AppBar,
  AppBarCloseButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityAppScreenTransparent: {};
  }
}

// Legacy AppScreen 회귀 검증 전용. 신규 activity 는 NextAppScreen 만 쓴다.
// NextAppScreen 짝: ActivityNextAppScreenTransparent
const ActivityAppScreenTransparent: StaticActivityComponentType<
  "ActivityAppScreenTransparent"
> = () => {
  return (
    <AppScreen theme="cupertino" layerOffsetTop="none" tone="transparent">
      <AppBar>
        <AppBarLeft>
          <AppBarCloseButton aria-label="Close" />
        </AppBarLeft>
        <AppBarMain>Transparent (Legacy)</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Notification">
            <IconBellFill />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <Flex
          height="full"
          justify="center"
          align="center"
          bg="palette.gray800"
          color="fg.neutralInverted"
        >
          Preview
        </Flex>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityAppScreenTransparent;
