import { IconBellLine, IconChevronLeftLine } from "@karrotmarket/react-monochrome-icon";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { Box, Flex } from "@seed-design/react";
import { seedPlugin } from "@seed-design/stackflow";
import { stackflow } from "@stackflow/react";
import {
  AppBar,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

function Activity() {
  return (
    <AppScreen theme="cupertino">
      <AppBar>
        <AppBarLeft>
          <AppBarIconButton aria-label="뒤로">
            <IconChevronLeftLine />
          </AppBarIconButton>
        </AppBarLeft>
        <AppBarMain title="동네생활" />
        <AppBarRight>
          <AppBarIconButton aria-label="알림">
            <IconBellLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <Flex height="full" align="center" justify="center" color="fg.neutralMuted">
          화면 콘텐츠
        </Flex>
      </AppScreenContent>
    </AppScreen>
  );
}

const { Stack } = stackflow({
  activities: { Activity },
  initialActivity: () => "Activity",
  plugins: [basicRendererPlugin(), seedPlugin({ theme: "cupertino" })],
  transitionDuration: 0,
});

export default function Preview() {
  return (
    <Box
      position="relative"
      width="375px"
      maxWidth="100%"
      height="375px"
      overflowX="hidden"
      overflowY="hidden"
      borderWidth={1}
      borderColor="stroke.neutralWeak"
      borderRadius="r4"
    >
      <Stack />
    </Box>
  );
}
