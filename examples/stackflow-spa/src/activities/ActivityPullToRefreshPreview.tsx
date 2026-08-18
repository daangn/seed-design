import { AppBar, AppScreen } from "@seed-design/stackflow";
import { type StaticActivityComponentType } from "@stackflow/react/future";
import { VStack } from "@seed-design/react";
import {
  PullToRefreshContent,
  PullToRefreshIndicator,
  PullToRefreshRoot,
} from "seed-design/ui/pull-to-refresh";

declare module "@stackflow/config" {
  interface Register {
    ActivityPullToRefreshPreview: {};
  }
}

// Legacy AppScreen 회귀 검증 전용. 신규 activity 는 NextAppScreen 만 쓴다.
// NextAppScreen 짝: ActivityNextPullToRefreshPreview
const ActivityPullToRefreshPreview: StaticActivityComponentType<
  "ActivityPullToRefreshPreview"
> = () => {
  // AppScreen is imported from @seed-design/stackflow instead of snippet for demo purpose.
  // AppScreen snippet is integrating PullToRefresh, so it's not necessary to use it here.
  return (
    <AppScreen.Root>
      <AppBar.Root>
        <AppBar.Main>
          <AppBar.Title>Pull To Refresh (Legacy)</AppBar.Title>
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
            <VStack px="spacingX.globalGutter">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam autem deserunt
              reprehenderit ducimus sunt. Quod laudantium excepturi tempora fuga repellendus
              accusantium nam maiores? Quas debitis, neque ullam eligendi minus sit?
            </VStack>
          </PullToRefreshContent>
        </AppScreen.Layer>
      </PullToRefreshRoot>
    </AppScreen.Root>
  );
};

export default ActivityPullToRefreshPreview;
