import { Box } from "@seed-design/react";
import type { ActivityComponentType } from "@stackflow/react/future";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { TabsCarousel, TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

declare module "@stackflow/config" {
  interface Register {
    ActivityAnimatedTabs: {};
  }
}

const ActivityAnimatedTabs: ActivityComponentType<"ActivityAnimatedTabs"> = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="Animated Tabs" />
      </AppBar>
      <AppScreenContent>
        <TabsRoot defaultValue="1" contentLayout="hug">
          <TabsList>
            <TabsTrigger value="1">Tab 1</TabsTrigger>
            <TabsTrigger value="x" disabled>
              Disabled
            </TabsTrigger>
            <TabsTrigger value="2" notification>
              Tab 2
            </TabsTrigger>
          </TabsList>
          <TabsCarousel autoHeight>
            <TabsContent value="1">
              <Box borderWidth={1} borderColor="stroke.neutralMuted" p="x2" height="1000px">
                Tab 1 content
              </Box>
            </TabsContent>
            <TabsContent value="2">
              <Box borderWidth={1} borderColor="stroke.neutralMuted" px="x2" py="x10">
                Tab 2 content
              </Box>
            </TabsContent>
          </TabsCarousel>
        </TabsRoot>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityAnimatedTabs;
