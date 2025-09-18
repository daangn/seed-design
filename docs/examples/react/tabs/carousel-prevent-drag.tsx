import { Box, Tabs } from "@seed-design/react";
import { TabsCarousel, TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

export default function TabsCarouselPreventDrag() {
  return (
    <Box width="360px" height="480px">
      <TabsRoot contentLayout="fill" defaultValue="1">
        <TabsList>
          <TabsTrigger value="1">Tab 1</TabsTrigger>
          <TabsTrigger value="2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsCarousel swipeable>
          <TabsContent value="1">
            <Box overflowX="scroll" {...Tabs.carouselPreventDrag}>
              <Box width="1000px" height="100px" bg="bg.criticalWeak">
                Scrollable area
              </Box>
            </Box>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reiciendis ab ex accusantium
            sit. Amet maxime eum molestiae nemo. Beatae sint omnis aut cumque doloremque fugit
            perspiciatis rerum possimus, reiciendis eaque?
          </TabsContent>
          <TabsContent value="2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </TabsContent>
        </TabsCarousel>
      </TabsRoot>
    </Box>
  );
}
