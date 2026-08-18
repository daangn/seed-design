import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { Flex } from "@seed-design/react";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import {
  NextAppBar,
  NextAppBarCloseButton,
  NextAppBarIconButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityNextAppScreenPreview: {};
  }
}

const ActivityNextAppScreenPreview: StaticActivityComponentType<
  "ActivityNextAppScreenPreview"
> = () => {
  return (
    <NextAppScreen theme="cupertino">
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarCloseButton />
        </NextAppBarLeft>
        <NextAppBarMain>Next Preview</NextAppBarMain>
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Notification">
            <IconBellFill />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <Flex height="full" justify="center" align="center">
          Next Preview
        </Flex>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityNextAppScreenPreview;
