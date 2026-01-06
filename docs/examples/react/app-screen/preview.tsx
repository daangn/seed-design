import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { Flex } from "@seed-design/react";
import type { ActivityComponentType } from "@stackflow/react/future";
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
    "react/app-screen/preview": {};
  }
}

const AppScreenPreviewActivity: ActivityComponentType<"react/app-screen/preview"> = () => {
  return (
    <AppScreen theme="cupertino">
      <AppBar>
        <AppBarLeft>
          <AppBarCloseButton />
        </AppBarLeft>
        <AppBarMain>Preview</AppBarMain>
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

export default AppScreenPreviewActivity;
