import { Flex, Icon } from "@seed-design/react";
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import type { ActivityComponentType } from "@stackflow/react/future";
import { AppBar, AppBarIconButton, AppBarMain, AppBarRight } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

declare module "@stackflow/config" {
  interface Register {
    "react/app-screen/app-bar-customization": {};
  }
}

const AppScreenAppBarCustomizationActivity: ActivityComponentType<
  "react/app-screen/app-bar-customization"
> = () => {
  return (
    <AppScreen theme="android">
      <AppBar bg="palette.blue200">
        <AppBarMain title="Preview" subtitle="This is a nice preview." />
        <AppBarRight>
          <AppBarIconButton aria-label="Notification">
            <Icon svg={<IconBellFill />} color="palette.blue500" size="x5" />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <Flex justify="center" align="center" height="full">
          Preview
        </Flex>
      </AppScreenContent>
    </AppScreen>
  );
};

export default AppScreenAppBarCustomizationActivity;
