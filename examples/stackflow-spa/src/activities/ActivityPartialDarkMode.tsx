import type { ActivityComponentType } from "@stackflow/react/future";
import {
  AppBar,
  AppBarLeft,
  AppBarRight,
  AppBarMain,
  AppBarBackButton,
  AppBarIconButton,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

import { IconBellLine } from "@karrotmarket/react-monochrome-icon";
import { Box, VStack } from "@seed-design/react";

declare module "@stackflow/config" {
  interface Register {
    ActivityPartialDarkMode: {};
  }
}

const ActivityPartialDarkMode: ActivityComponentType<"ActivityPartialDarkMode"> = () => {
  return (
    <AppScreen>
      <AppBar divider>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="Partial Dark Mode" />
        <AppBarRight>
          <AppBarIconButton>
            <IconBellLine />
          </AppBarIconButton>
          <AppBarIconButton>
            <IconBellLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
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
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityPartialDarkMode;
