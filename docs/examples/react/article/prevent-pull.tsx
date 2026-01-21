import { VStack, Icon, Text, Article, Divider, PullToRefresh } from "@seed-design/react";
import { ActivityComponentType } from "@stackflow/react/future";
import { AppBar, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import {
  PullToRefreshContent,
  PullToRefreshIndicator,
  PullToRefreshRoot,
} from "seed-design/ui/pull-to-refresh";
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { PageBanner } from "seed-design/ui/page-banner";

declare module "@stackflow/config" {
  interface Register {
    "react/article/prevent-pull": {};
  }
}

const ArticlePreventPull: ActivityComponentType<"react/article/prevent-pull"> = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarMain>Pull To Refresh</AppBarMain>
      </AppBar>
      <AppScreenContent>
        <PullToRefreshRoot
          onPtrReady={() => {}}
          onPtrRefresh={async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }}
        >
          <PullToRefreshIndicator />
          <PullToRefreshContent asChild>
            <VStack gap="x8" style={{ userSelect: "none" }}>
              <PageBanner
                prefixIcon={<IconExclamationmarkCircleFill />}
                description="상위 요소에 `user-select: none;` 스타일 적용됨"
                tone="warning"
                variant="solid"
              />
              <VStack asChild gap="spacingY.componentDefault" px="spacingX.globalGutter">
                <Article {...PullToRefresh.preventPull}>
                  <Text textStyle="t6Bold" as="h1">
                    Article
                  </Text>
                  <Text textStyle="articleBody" as="p">
                    이 요소는 Article 내부에 있으므로 텍스트 선택이 가능합니다. 이 Article은 PTR
                    제스처를 호출하지 않도록 설정되어 있습니다. 여기를 아래로 끌어 당기면 PTR이
                    작동하는 대신 텍스트가 선택됩니다.
                  </Text>
                </Article>
              </VStack>
              <Divider />
              <VStack gap="spacingY.componentDefault" px="spacingX.globalGutter">
                <Text textStyle="t6Bold" as="h1">
                  Article 외부
                </Text>
                <Text textStyle="articleBody" as="p">
                  이 요소는 Article 외부에 있으므로 텍스트 선택이 불가능합니다. 이 요소는 PTR을
                  호출할 수 있습니다. 여기를 아래로 끌어 당겨보세요.
                </Text>
              </VStack>
            </VStack>
          </PullToRefreshContent>
        </PullToRefreshRoot>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ArticlePreventPull;
