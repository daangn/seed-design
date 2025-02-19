import { Stack } from "@seed-design/react";
import { ActivityComponentType } from "@stackflow/react/future";
import { AppBar, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import {
  PullToRefreshContent,
  PullToRefreshIndicator,
  PullToRefreshRoot,
} from "seed-design/ui/pull-to-refresh";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

declare module "@stackflow/config" {
  interface Register {
    "pull-to-refresh-tabs": unknown;
  }
}

const PullToRefreshTabs: ActivityComponentType<"pull-to-refresh-tabs"> = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarMain>Pull To Refresh</AppBarMain>
      </AppBar>
      <AppScreenContent>
        <TabsRoot defaultValue="1" contentLayout="fill">
          <TabsList>
            <TabsTrigger value="1">Tab 1</TabsTrigger>
            <TabsTrigger value="2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="1">
            <PullToRefreshRoot
              onPtrReady={() => {}}
              onPtrRefresh={async () => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
              }}
            >
              <PullToRefreshIndicator />
              <PullToRefreshContent asChild>
                <Stack paddingX="spacingX.globalGutter">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam autem deserunt
                  reprehenderit ducimus sunt. Quod laudantium excepturi tempora fuga repellendus
                  accusantium nam maiores? Quas debitis, neque ullam eligendi minus sit?
                </Stack>
              </PullToRefreshContent>
            </PullToRefreshRoot>
          </TabsContent>
          <TabsContent value="2">
            <Stack paddingX="spacingX.globalGutter">PTR is not available in this tab.</Stack>
          </TabsContent>
        </TabsRoot>
      </AppScreenContent>
    </AppScreen>
  );
};

export default PullToRefreshTabs;
