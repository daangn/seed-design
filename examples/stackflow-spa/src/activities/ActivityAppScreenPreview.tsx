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
    ActivityAppScreenPreview: {};
  }
}

// Legacy AppScreen 회귀 검증 전용. 신규 activity 는 NextAppScreen 만 쓴다.
// NextAppScreen 짝: ActivityNextAppScreenPreview
const ActivityAppScreenPreview: StaticActivityComponentType<"ActivityAppScreenPreview"> = () => {
  return (
    <AppScreen theme="cupertino">
      <AppBar>
        <AppBarLeft>
          <AppBarCloseButton />
        </AppBarLeft>
        <AppBarMain>Preview (Legacy)</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Notification">
            <IconBellFill />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <Flex height="full" justify="center" align="center">
          Preview
        </Flex>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityAppScreenPreview;
