import { Box, HStack, Portal, PullToRefresh, Tabs, Text, VStack } from "@seed-design/react";
import { useActivity, useFlow, type ActivityComponentType } from "@stackflow/react/future";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { ProgressCircle } from "seed-design/ui/progress-circle";
import { TabsCarousel, TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";
import { useTheme } from "../contexts/ThemeContext";
import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "seed-design/ui/alert-dialog";
import { ListButtonItem } from "seed-design/ui/list";
import { ActionButton } from "seed-design/ui/action-button";
import { useStepOverlay } from "seed-design/stackflow/use-step-overlay";
import { useZIndexBase } from "@seed-design/stackflow";

declare module "@stackflow/config" {
  interface Register {
    ActivitySwipeableTabs: {};
  }
}

const ActivitySwipeableTabs: ActivityComponentType<"ActivitySwipeableTabs"> = () => {
  const { overlayProps, setOpen } = useStepOverlay({ id: "alert-dialog" });
  const { push } = useFlow();

  return (
    <AppScreen theme={useTheme().theme}>
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
                    <Box overflowX="scroll" {...Tabs.carouselPreventDrag}>
                      <Box width="1000px">Scrolling Area</Box>
                    </Box>
                    <AlertDialogRoot {...overlayProps}>
                      <AlertDialogTrigger asChild>
                        <ListButtonItem title="AlertDialog (step)" />
                      </AlertDialogTrigger>
                      <Portal>
                        <AlertDialogContent layerIndex={useZIndexBase()}>
                          <AlertDialogHeader>
                            <AlertDialogTitle>제목</AlertDialogTitle>
                            <AlertDialogDescription>
                              Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <VStack gap="x2">
                              <ActionButton onClick={() => setOpen(false)}>확인</ActionButton>
                              <ActionButton
                                variant="neutralSolid"
                                onClick={() => push("ActivityChipButton", {})}
                              >
                                Push
                              </ActionButton>
                            </VStack>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </Portal>
                    </AlertDialogRoot>
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
