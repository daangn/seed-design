import type { ActivityComponentType } from "@stackflow/react";
import {
  AppBar,
  AppBarLeft,
  AppBarRight,
  AppBarMain,
  AppBarBackButton,
  AppBarIconButton,
} from "../design-system/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../design-system/stackflow/AppScreen";

import { IconBellLine } from "@daangn/react-monochrome-icon";
import { Box, Stack } from "@seed-design/react";

const ActivityPartialDarkMode: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar tone="layer" divider>
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
        <Stack>
          <Box background="bg.layerDefault" color="fg.neutral" padding="x4">
            This is System Mode
          </Box>
          <Box
            background="bg.layerDefault"
            color="fg.neutral"
            padding="x4"
            data-seed-color-mode="light-only"
          >
            This is Light Only Mode
          </Box>
          <Box
            background="bg.layerDefault"
            color="fg.neutral"
            padding="x4"
            data-seed-color-mode="dark-only"
          >
            This is Dark Only Mode
          </Box>
        </Stack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityPartialDarkMode;
