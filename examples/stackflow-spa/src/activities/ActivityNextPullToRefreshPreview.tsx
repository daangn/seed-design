import { VStack } from "@seed-design/react";
import { type StaticActivityComponentType } from "@stackflow/react/future";
import { NextAppBar, NextAppBarMain } from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityNextPullToRefreshPreview: {};
  }
}

const ActivityNextPullToRefreshPreview: StaticActivityComponentType<
  "ActivityNextPullToRefreshPreview"
> = () => {
  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarMain>Pull To Refresh</NextAppBarMain>
      </NextAppBar>
      <NextAppScreenContent
        ptr
        onPtrRefresh={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      >
        <VStack px="spacingX.globalGutter">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam autem deserunt
          reprehenderit ducimus sunt. Quod laudantium excepturi tempora fuga repellendus accusantium
          nam maiores? Quas debitis, neque ullam eligendi minus sit?
        </VStack>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityNextPullToRefreshPreview;
