import { Box, PullToRefresh, VStack } from "@seed-design/react";
import { type StaticActivityComponentType } from "@stackflow/react/future";
import { NextAppBar, NextAppBarMain } from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityNextPullToRefreshPreventPull: {};
  }
}

const ActivityNextPullToRefreshPreventPull: StaticActivityComponentType<
  "ActivityNextPullToRefreshPreventPull"
> = () => {
  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarMain>Pull To Refresh preventPull</NextAppBarMain>
      </NextAppBar>
      <NextAppScreenContent
        ptr
        onPtrRefresh={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      >
        <VStack px="spacingX.globalGutter" gap="x4">
          <Box p="x4" bg="bg.neutralWeak" color="fg.neutral" borderRadius="r2">
            이 영역은 당겨서 새로고침이 가능합니다. Amet in laborum proident fugiat mollit quis aute
            mollit esse nostrud. Excepteur ea proident ipsum duis. Nulla Lorem pariatur exercitation
            velit anim.
          </Box>
          <Box
            p="x4"
            bg="bg.criticalWeak"
            color="fg.criticalContrast"
            borderRadius="r2"
            {...PullToRefresh.preventPull}
          >
            이 영역은 당겨서 새로고침이 불가능합니다. Aliquip ad amet eu dolore id enim excepteur
            laboris officia anim in. Irure irure nulla sit eiusmod aliqua sint excepteur amet
            laboris.
          </Box>
          <Box p="x4" bg="bg.neutralWeak" color="fg.neutral" borderRadius="r2">
            이 영역은 당겨서 새로고침이 가능합니다. Amet in laborum proident fugiat mollit quis aute
            mollit esse nostrud. Excepteur ea proident ipsum duis. Nulla Lorem pariatur exercitation
            velit anim.
          </Box>
          <Box
            p="x4"
            bg="bg.criticalWeak"
            color="fg.criticalContrast"
            borderRadius="r2"
            {...PullToRefresh.preventPull}
          >
            이 영역은 당겨서 새로고침이 불가능합니다. Aliquip ad amet eu dolore id enim excepteur
            laboris officia anim in. Irure irure nulla sit eiusmod aliqua sint excepteur amet
            laboris.
          </Box>
        </VStack>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityNextPullToRefreshPreventPull;
