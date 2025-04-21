import { Box } from "@seed-design/react";
import type { ActivityComponentType } from "@stackflow/react";
import { useEffect, useState } from "react";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "../seed-design/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../seed-design/stackflow/AppScreen";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "../seed-design/ui/tabs";

const ActivityTabs: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="Tabs" />
      </AppBar>
      <AppScreenContent>
        <Box p="x4">Sticky Tablist</Box>
        <TabsRoot stickyList defaultValue="1" triggerLayout="hug" contentLayout="hug">
          <TabsList>
            <TabsTrigger value="1">Tab 1</TabsTrigger>
            <TabsTrigger value="2">Tab 2</TabsTrigger>
            <TabsTrigger value="3">Tab 3</TabsTrigger>
            <TabsTrigger value="4">Tab 4</TabsTrigger>
            <TabsTrigger value="5">Tab 1231235</TabsTrigger>
            <TabsTrigger value="6">Tab 12312312361</TabsTrigger>
            <TabsTrigger value="7">Tab 7123123123123</TabsTrigger>
          </TabsList>
          <TabsContent value="1">
            <Box borderWidth={1} borderColor="stroke.neutral" p="x2" height="1000px">
              Tab 1 content
            </Box>
          </TabsContent>
          <TabsContent value="2">
            <AsyncContent>
              <Box borderWidth={1} borderColor="stroke.neutral" px="x2" py="x10">
                Tab 2 content
              </Box>
            </AsyncContent>
          </TabsContent>
          <TabsContent value="3">
            <Box borderWidth={1} borderColor="stroke.neutral" px="x2" py="x10">
              Tab 3 content
            </Box>
          </TabsContent>
          <TabsContent value="4">
            <Box borderWidth={1} borderColor="stroke.neutral" px="x2" py="x10">
              Tab 4 content
            </Box>
          </TabsContent>
          <TabsContent value="5">
            <Box borderWidth={1} borderColor="stroke.neutral" px="x2" py="x10">
              Tab 5 content
            </Box>
          </TabsContent>
          <TabsContent value="6">
            <Box borderWidth={1} borderColor="stroke.neutral" px="x2" py="x10">
              Tab 6 content
            </Box>
          </TabsContent>
          <TabsContent value="7">
            <Box borderWidth={1} borderColor="stroke.neutral" px="x2" py="x10">
              Tab 7 content
            </Box>
          </TabsContent>
        </TabsRoot>
      </AppScreenContent>
    </AppScreen>
  );
};

const AsyncContent = (props: { children: React.ReactNode }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 1000);
  }, []);

  return loaded ? <>{props.children}</> : <div>Loading...</div>;
};

export default ActivityTabs;
