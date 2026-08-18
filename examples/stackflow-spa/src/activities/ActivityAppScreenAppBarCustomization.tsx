import { Flex, Icon } from "@seed-design/react";
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import {
  NextAppBar,
  NextAppBarIconButton,
  NextAppBarMain,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityAppScreenAppBarCustomization: {};
  }
}

const ActivityAppScreenAppBarCustomization: StaticActivityComponentType<
  "ActivityAppScreenAppBarCustomization"
> = () => {
  return (
    <NextAppScreen theme="android">
      <NextAppBar bg="palette.blue200">
        <NextAppBarMain title="Preview" subtitle="This is a nice preview." />
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Notification">
            <Icon svg={<IconBellFill />} color="palette.blue500" size="x5" />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <Flex justify="center" align="center" height="full">
          Preview
        </Flex>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityAppScreenAppBarCustomization;
