import { Box } from "@seed-design/react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarIconButton,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";
import { TabsCarousel, TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";

declare module "@stackflow/config" {
  interface Register {
    ActivityAnimatedTabs: {};
  }
}

const ActivityAnimatedTabs: StaticActivityComponentType<"ActivityAnimatedTabs"> = () => {
  const { push } = useFlow();

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="Animated Tabs" />
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
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
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityAnimatedTabs;
