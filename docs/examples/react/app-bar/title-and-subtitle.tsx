import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { Box, Flex } from "@seed-design/react";
import { seedPlugin } from "@seed-design/stackflow";
import { stackflow } from "@stackflow/react";
import { AppBar, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

function Activity() {
  return (
    <AppScreen theme="cupertino">
      <AppBar>
        <AppBarMain title="관심 목록" subtitle="3개의 새 소식" />
      </AppBar>
      <AppScreenContent>
        <Flex height="full" align="center" justify="center" color="fg.neutralMuted">
          제목과 부제목을 함께 표시한 AppBar
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

export default function TitleAndSubtitle() {
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
