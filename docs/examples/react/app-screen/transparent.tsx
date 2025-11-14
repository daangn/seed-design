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
    "react/app-screen/transparent-bar": {};
  }
}

const AppScreenTransparentBarActivity: ActivityComponentType<
  "react/app-screen/transparent-bar"
> = () => {
  return (
    <AppScreen theme="cupertino" layerOffsetTop="none" tone="transparent">
      <AppBar>
        <AppBarLeft>
          <AppBarCloseButton aria-label="Close" />
        </AppBarLeft>
        <AppBarMain>Preview</AppBarMain>
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

export default AppScreenTransparentBarActivity;
