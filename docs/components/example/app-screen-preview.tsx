import { IconBellFill } from "@daangn/react-monochrome-icon";
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
import { Flex } from "@seed-design/react";

declare module "@stackflow/config" {
  interface Register {
    "app-screen-preview": unknown;
  }
}

const AppScreenPreviewActivity: ActivityComponentType<"app-screen-preview"> = () => {
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
        <Flex height="full" justifyContent="center" alignItems="center">
          Preview
        </Flex>
      </AppScreenContent>
    </AppScreen>
  );
};

export default AppScreenPreviewActivity;
