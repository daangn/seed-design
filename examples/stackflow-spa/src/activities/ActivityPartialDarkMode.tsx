import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import {
  NextAppBar,
  NextAppBarLeft,
  NextAppBarRight,
  NextAppBarMain,
  NextAppBarBackButton,
  NextAppBarIconButton,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";

import { IconBellLine, IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { Box, VStack } from "@seed-design/react";

declare module "@stackflow/config" {
  interface Register {
    ActivityPartialDarkMode: {};
  }
}

const ActivityPartialDarkMode: StaticActivityComponentType<"ActivityPartialDarkMode"> = () => {
  const { push } = useFlow();

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="Partial Dark Mode" />
        <NextAppBarRight>
          <NextAppBarIconButton>
            <IconBellLine />
          </NextAppBarIconButton>
          <NextAppBarIconButton>
            <IconBellLine />
          </NextAppBarIconButton>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <VStack>
          <Box bg="bg.layerDefault" color="fg.neutral" p="x4">
            This is System Mode
          </Box>
          <Box bg="bg.layerDefault" color="fg.neutral" p="x4" data-seed-color-mode="light-only">
            This is Light Only Mode
          </Box>
          <Box bg="bg.layerDefault" color="fg.neutral" p="x4" data-seed-color-mode="dark-only">
            This is Dark Only Mode
          </Box>
        </VStack>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityPartialDarkMode;
