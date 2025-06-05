import { Box, HStack, PullToRefresh, Text, VStack } from "@seed-design/react";
import type { ActivityComponentType } from "@stackflow/react";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "../seed-design/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../seed-design/stackflow/AppScreen";
import { ProgressCircle } from "../seed-design/ui/progress-circle";
import { TabsCarousel, TabsContent, TabsList, TabsRoot, TabsTrigger } from "../seed-design/ui/tabs";

const ActivitySwipeableTabs: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="Swipeable Tabs" />
      </AppBar>
      <AppScreenContent>
        <TabsRoot defaultValue="1">
          <TabsList>
            <TabsTrigger value="1">Tab 1</TabsTrigger>
            <TabsTrigger value="x" disabled>
              Disabled
            </TabsTrigger>
            <TabsTrigger value="2" notification>
              Tab 2
            </TabsTrigger>
          </TabsList>
          <TabsCarousel swipeable>
            <TabsContent value="1">
              <PullToRefresh.Root
                style={{ height: "100%" }}
                onPtrRefresh={async () => {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                }}
              >
                <PullToRefresh.Indicator>
                  {(props) => <ProgressCircle tone="brand" size="24" {...props} />}
                </PullToRefresh.Indicator>
                <PullToRefresh.Content>
                  <VStack>
                    <Box overflowX="scroll" data-embla-prevent-drag>
                      <Box width="1000px">Scrolling Area</Box>
                    </Box>
                    <Feed />
                    <Feed />
                    <Feed />
                    <Feed />
                    <Feed />
                    <Feed />
                    <Feed />
                    <Feed />
                    <Feed />
                    <Feed />
                  </VStack>
                </PullToRefresh.Content>
              </PullToRefresh.Root>
            </TabsContent>
            <TabsContent value="2">
              <VStack>
                <Feed />
                <Feed />
                <Feed />
                <Feed />
                <Feed />
                <Feed />
                <Feed />
                <Feed />
                <Feed />
                <Feed />
              </VStack>
            </TabsContent>
          </TabsCarousel>
        </TabsRoot>
      </AppScreenContent>
    </AppScreen>
  );
};

const Feed = () => {
  return (
    <VStack
      as="button"
      style={{ textAlign: "start" }}
      gap="x2_5"
      px="spacingX.globalGutter"
      py="x1"
    >
      <VStack gap="x2">
        <VStack gap="x1">
          <Text as="h1" textStyle="t5Medium" color="fg.neutral" maxLines={1}>
            독서 습관 만들기
          </Text>
          <Text as="p" textStyle="t4Regular" color="fg.neutralMuted" maxLines={2}>
            하루 10페이지부터 시작하자. 취침 전 20분 독서는 수면의 질도 높여주는 일석이조 습관이다.
          </Text>
        </VStack>
        <HStack align="center" gap="x2">
          <Text textStyle="t4Regular" color="fg.neutralSubtle">
            라이프스타일 ⸱ 서초2동
          </Text>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default ActivitySwipeableTabs;
