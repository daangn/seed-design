import { AppBar, AppScreen } from "@seed-design/stackflow";
import { ActivityComponentType } from "@stackflow/react/future";
import { VStack, PullToRefresh, Box } from "@seed-design/react";
import {
  PullToRefreshContent,
  PullToRefreshIndicator,
  PullToRefreshRoot,
} from "seed-design/ui/pull-to-refresh";

declare module "@stackflow/config" {
  interface Register {
    "react/pull-to-refresh/prevent-pull": {};
  }
}

const PullToRefreshPreventPull: ActivityComponentType<
  "react/pull-to-refresh/prevent-pull"
> = () => {
  // AppScreen is imported from @seed-design/stackflow instead of snippet for demo purpose.
  // AppScreen snippet is integrating PullToRefresh, so it's not necessary to use it here.
  return (
    <AppScreen.Root>
      <AppBar.Root divider>
        <AppBar.Main>
          <AppBar.Title>Pull To Refresh</AppBar.Title>
        </AppBar.Main>
      </AppBar.Root>
      <PullToRefreshRoot
        asChild
        onPtrReady={() => {}}
        onPtrRefresh={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      >
        <AppScreen.Layer>
          <PullToRefreshIndicator />
          <PullToRefreshContent asChild>
            <VStack px="spacingX.globalGutter" gap="x4">
              <Box p="x4" bg="bg.neutralWeak" color="fg.neutral" borderRadius="r2">
                이 영역은 당겨서 새로고침이 가능합니다. Amet in laborum proident fugiat mollit quis
                aute mollit esse nostrud. Excepteur ea proident ipsum duis. Nulla Lorem pariatur
                exercitation velit anim.
              </Box>
              <Box
                p="x4"
                bg="bg.criticalWeak"
                color="fg.criticalContrast"
                borderRadius="r2"
                {...PullToRefresh.preventPull}
              >
                이 영역은 당겨서 새로고침이 불가능합니다. Aliquip ad amet eu dolore id enim
                excepteur laboris officia anim in. Irure irure nulla sit eiusmod aliqua sint
                excepteur amet laboris.
              </Box>
              <Box p="x4" bg="bg.neutralWeak" color="fg.neutral" borderRadius="r2">
                이 영역은 당겨서 새로고침이 가능합니다. Amet in laborum proident fugiat mollit quis
                aute mollit esse nostrud. Excepteur ea proident ipsum duis. Nulla Lorem pariatur
                exercitation velit anim.
              </Box>
              <Box
                p="x4"
                bg="bg.criticalWeak"
                color="fg.criticalContrast"
                borderRadius="r2"
                {...PullToRefresh.preventPull}
              >
                이 영역은 당겨서 새로고침이 불가능합니다. Aliquip ad amet eu dolore id enim
                excepteur laboris officia anim in. Irure irure nulla sit eiusmod aliqua sint
                excepteur amet laboris.
              </Box>
            </VStack>
          </PullToRefreshContent>
        </AppScreen.Layer>
      </PullToRefreshRoot>
    </AppScreen.Root>
  );
};

export default PullToRefreshPreventPull;
