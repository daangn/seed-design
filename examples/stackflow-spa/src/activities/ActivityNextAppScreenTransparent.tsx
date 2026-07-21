import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { Flex } from "@seed-design/react";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarIconButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityNextAppScreenTransparent: {};
  }
}

const ActivityNextAppScreenTransparent: StaticActivityComponentType<
  "ActivityNextAppScreenTransparent"
> = () => {
  return (
    <NextAppScreen contentOffsetTop="none" tone="transparent">
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain>Transparent</NextAppBarMain>
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Notification">
            <IconBellFill />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <Flex
          height="full"
          justify="center"
          align="center"
          bg="palette.gray800"
          color="fg.neutralInverted"
        >
          Transparent
        </Flex>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityNextAppScreenTransparent;
