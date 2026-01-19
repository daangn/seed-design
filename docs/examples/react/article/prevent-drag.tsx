import { VStack, Icon, Text, Article, Divider, Tabs } from "@seed-design/react";
import { ActivityComponentType } from "@stackflow/react/future";
import { AppBar, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { TabsCarousel, TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { PageBanner } from "seed-design/ui/page-banner";

declare module "@stackflow/config" {
  interface Register {
    "react/article/prevent-drag": {};
  }
}

const ArticlePreventDrag: ActivityComponentType<"react/article/prevent-drag"> = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarMain>Tabs</AppBarMain>
      </AppBar>
      <AppScreenContent>
        <TabsRoot defaultValue="1" contentLayout="fill">
          <TabsList>
            <TabsTrigger value="1">Tab 1</TabsTrigger>
            <TabsTrigger value="2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsCarousel swipeable>
            <TabsContent value="1">
              <VStack gap="x8" style={{ userSelect: "none" }}>
                <PageBanner
                  prefixIcon={<IconExclamationmarkCircleFill />}
                  description="상위 요소에 `user-select: none;` 스타일 적용됨"
                  tone="warning"
                  variant="solid"
                />
                <VStack asChild gap="spacingY.componentDefault" px="spacingX.globalGutter">
                  <Article {...Tabs.carouselPreventDrag}>
                    <Text textStyle="t6Bold" as="h1">
                      Article
                    </Text>
                    <Text textStyle="articleBody" as="p">
                      이 요소는 Article 내부에 있으므로 텍스트 선택이 가능합니다. 이 Article은 Tabs
                      제스처를 호출하지 않도록 설정되어 있습니다. 여기를 왼쪽으로 스와이프하면 탭이
                      전환되는 대신 텍스트가 선택됩니다.
                    </Text>
                  </Article>
                </VStack>
                <Divider />
                <VStack gap="spacingY.componentDefault" px="spacingX.globalGutter">
                  <Text textStyle="t6Bold" as="h1">
                    Article 외부
                  </Text>
                  <Text textStyle="articleBody" as="p">
                    이 요소는 Article 외부에 있으므로 텍스트 선택이 불가능합니다. 이 요소는 탭
                    스와이프를 호출할 수 있습니다. 여기를 왼쪽으로 스와이프해보세요.
                  </Text>
                </VStack>
              </VStack>
            </TabsContent>
            <TabsContent value="2">
              <VStack px="spacingX.globalGutter" py="x4">
                안녕하세요!
              </VStack>
            </TabsContent>
          </TabsCarousel>
        </TabsRoot>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ArticlePreventDrag;
