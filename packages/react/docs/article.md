file: components/article.mdx

# Article

Article은 일관된 selection 및 줄바꿈 정책을 사용할 수 있게 돕는 유틸리티 컴포넌트입니다.

사용 가능 버전: @seed-design/react@1.0.6, @seed-design/css@1.0.6

## Preview

```tsx
import { Article, Text, VStack } from "@seed-design/react";

export default function ArticlePreview() {
  return (
    <VStack asChild gap="x2" width="400px">
      <Article>
        <Text as="p" textStyle="articleBody">
          Article은 일관된 selection 및 줄바꿈 정책을 사용할 수 있게 돕는 유틸리티 컴포넌트입니다.
        </Text>
        <Text as="p" textStyle="articleBody">
          여기를 드래그해서 선택해보세요.
        </Text>
      </Article>
    </VStack>
  );
}
```

## Usage \[#usage]

```tsx
import { Article } from "@seed-design/react";
```

```tsx
<Article>Article</Article>
```

## Props \[#props]

[BoxProps](/react/components/layout/box#props)와 동일합니다.

## Examples \[#examples]

### Word Break Behavior \[#word-break-behavior]

[`lang` global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang)를 통해 추론된 언어에 따라 단어 내 줄바꿈(word-break) 동작을 설정합니다.

한국어 문서/요소에서는 한 어절 안에서 줄바꿈이 발생하지 않도록 하고, 그 외 언어는 표준 규칙을 따릅니다. 컨테이너를 벗어날 정도로 긴 단어 안에서는 줄바꿈이 발생합니다. 일본어에서 문장 부호 직전, [스테가나](https://ko.wikipedia.org/wiki/스테가나) 직전, [반복 부호](https://ko.wikipedia.org/wiki/반복_부호) 직전 등 어색한 위치에서 줄바꿈이 발생하지 않도록 조정됩니다.

```tsx
import { Article, Text, VStack } from "@seed-design/react";

export default function ArticleWordBreak() {
  return (
    <VStack gap="spacingY.componentDefault" align="center" width="full">
      <VStack
        gap="x3"
        width="600px"
        style={{ resize: "horizontal", overflow: "auto", maxWidth: "100%" }}
      >
        <VStack
          asChild
          borderColor="stroke.neutralMuted"
          borderWidth={1}
          borderRadius="r2"
          p="x4"
          gap="x1"
          bg="bg.neutralWeak"
        >
          <Article lang="ko-KR">
            <Text as="p" textStyle="t5Bold">
              ko-KR
            </Text>
            <Text as="p" textStyle="articleBody" lang="ko-KR">
              <span>
                단어 내부 줄바꿈 처리를 적절하게 하여 가독성을 높입니다.
                이렇게매우긴단어를줄바꿈하지않는경우레이아웃문제를일으킬가능성이있습니다.{" "}
              </span>
              <a
                href="https://www.example.com/this-is-a-very-long-url-that-might-cause-layout-issues-if-the-word-break-is-not-handled-properly?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.example.com/this-is-a-very-long-url-that-might-cause-layout-issues-if-the-word-break-is-not-handled-properly?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale
              </a>
            </Text>
          </Article>
        </VStack>
        <VStack
          asChild
          borderColor="stroke.neutralMuted"
          borderWidth={1}
          borderRadius="r2"
          p="x4"
          gap="x1"
          bg="bg.neutralWeak"
        >
          <Article lang="en-US">
            <Text as="p" textStyle="t5Bold">
              en-US
            </Text>
            <Text as="p" textStyle="articleBody">
              <span>
                There are some long words that need to be broken properly to improve readability.
                SupercalifragilisticexpialidociousEvenThoughTheSoundOfItIsSomethingQuiteAtrocious{" "}
              </span>
              <a
                href="https://www.example.com/this-is-a-very-long-url-that-might-cause-layout-issues-if-the-word-break-is-not-handled-properly?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.example.com/this-is-a-very-long-url-that-might-cause-layout-issues-if-the-word-break-is-not-handled-properly?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale
              </a>
            </Text>
          </Article>
        </VStack>
        <VStack
          asChild
          borderColor="stroke.neutralMuted"
          borderWidth={1}
          borderRadius="r2"
          p="x4"
          gap="x1"
          bg="bg.neutralWeak"
        >
          <Article lang="ja-JP">
            <Text as="p" textStyle="t5Bold">
              ja-JP
            </Text>
            <Text as="p" textStyle="articleBody" lang="ja-JP">
              <span>
                日本語の禁則処理では、特定の文字の前後で改行を制御します。例えば人々々々と続く場合や、小さい文字ぁぁぁが連続する場合、そして句読点。。。が続く場合の改行位置を確認できます。
                また長い文章では自動的に適切な位置で改行されますが々ぁ。などの文字の前では改行されないことを確認してください。{" "}
              </span>
              <a
                href="https://www.example.com/this-is-a-very-long-url-that-might-cause-layout-issues-if-the-word-break-is-not-handled-properly?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.example.com/this-is-a-very-long-url-that-might-cause-layout-issues-if-the-word-break-is-not-handled-properly?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale
              </a>
            </Text>
          </Article>
        </VStack>
      </VStack>
      <Text textStyle="t3Medium">핸들을 잡고 너비를 조정해보세요.</Text>
    </VStack>
  );
}
```

### User Select Behavior \[#user-select-behavior]

`<Article />` 내부 요소는 사용자가 선택(user-select)할 수 있습니다.

```tsx
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Article, Divider, Icon, Text, VStack } from "@seed-design/react";
import { PageBanner } from "seed-design/ui/page-banner";

export default function ArticleSelectable() {
  return (
    <VStack
      style={{ userSelect: "none" }}
      width="400px"
      borderColor="stroke.neutralWeak"
      borderWidth={1}
      borderRadius="r2"
      overflowX="hidden"
      overflowY="hidden"
    >
      <PageBanner
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="상위 요소에 `user-select: none;` 스타일 적용됨"
        tone="warning"
        variant="solid"
      />
      <VStack as="article" gap="x4" px="spacingX.globalGutter" py="x4">
        <Text as="h1" textStyle="t7Bold">
          Article 밖은 선택할 수 없습니다.
        </Text>
        <Text as="p" textStyle="articleBody">
          상위 요소에 `user-select: none;` 스타일이 적용되어 있어 이 영역의 텍스트는 선택할 수
          없습니다. 길게 탭하거나 더블 클릭해보세요.
        </Text>
      </VStack>
      <Divider color="stroke.neutralWeak" />
      <VStack asChild gap="x4" px="spacingX.globalGutter" py="x4">
        <Article>
          <Text as="h1" textStyle="t7Bold">
            Article 안
          </Text>
          <Text as="p" textStyle="articleBody">
            상위 요소에 `user-select: none;` 스타일이 적용되었지만 Article 내부는 선택할 수
            있습니다. 길게 탭하거나 더블 클릭해서 텍스트를 선택해보세요.
          </Text>
        </Article>
      </VStack>
      <Divider color="stroke.neutralWeak" />
      <VStack as="article" gap="x4" px="spacingX.globalGutter" py="x4">
        <Text as="h1" textStyle="t7Bold">
          Article 밖은 선택할 수 없습니다.
        </Text>
        <Text as="p" textStyle="articleBody">
          길게 탭하거나 더블 클릭해보세요.
        </Text>
      </VStack>
    </VStack>
  );
}
```

#### Disable User Selection \[#disable-user-selection]

Text 컴포넌트의 [`userSelect="none"` prop](/react/components/typography/text#user-select)을 사용하여 `<Article />` 내부 요소를 선택 불가능하게 만들 수 있습니다.

<Card title="Text" href="/react/components/typography/text" icon="<IconComponent />">
  Text 컴포넌트에 대해 자세히 알아봅니다.
</Card>

```tsx
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Article, Divider, Icon, Text, VStack } from "@seed-design/react";
import { PageBanner } from "seed-design/ui/page-banner";

export default function ArticleSelectable() {
  return (
    <VStack
      style={{ userSelect: "none" }}
      width="400px"
      borderColor="stroke.neutralWeak"
      borderWidth={1}
      borderRadius="r2"
      overflowX="hidden"
      overflowY="hidden"
    >
      <PageBanner
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="상위 요소에 `user-select: none;` 스타일 적용됨"
        tone="warning"
        variant="solid"
      />
      <VStack as="article" gap="x4" px="spacingX.globalGutter" py="x4">
        <Text as="h1" textStyle="t7Bold">
          Article 밖은 선택할 수 없습니다.
        </Text>
        <Text as="p" textStyle="articleBody">
          상위 요소에 `user-select: none;` 스타일이 적용되어 있어 이 영역의 텍스트는 선택할 수
          없습니다. 길게 탭하거나 더블 클릭해보세요.
        </Text>
      </VStack>
      <Divider color="stroke.neutralWeak" />
      <VStack asChild gap="x4" px="spacingX.globalGutter" py="x4">
        <Article>
          <Text as="h1" textStyle="t7Bold">
            Article 안
          </Text>
          <Text as="p" textStyle="articleBody">
            상위 요소에 `user-select: none;` 스타일이 적용되었지만 Article 내부는 선택할 수
            있습니다. 길게 탭하거나 더블 클릭해서 텍스트를 선택해보세요.
          </Text>
          <Text as="p" textStyle="articleBody" userSelect="none">
            이 요소는 Article 내부에 있지만 선택할 수 없습니다.
          </Text>
        </Article>
      </VStack>
      <Divider color="stroke.neutralWeak" />
      <VStack as="article" gap="x4" px="spacingX.globalGutter" py="x4">
        <Text as="h1" textStyle="t7Bold">
          Article 밖은 선택할 수 없습니다.
        </Text>
        <Text as="p" textStyle="articleBody">
          길게 탭하거나 더블 클릭해보세요.
        </Text>
      </VStack>
    </VStack>
  );
}
```

#### Prevent `PullToRefresh` or `TabsCarousel` Gestures \[#prevent-pulltorefresh-or-tabscarousel-gestures]

`<Article />` 내부 요소는 사용자 선택이 가능합니다. 따라서, 드래그 동작을 통해 내부 요소를 선택 시 의도하지 않은 PTR(당겨서 새로고침) 또는 탭 스와이프 제스처가 발생할 수 있습니다.

`PullToRefresh.preventPull` 또는 `Tabs.carouselPreventDrag`를 `<Article />`에 전달하여 Article에서 발생한 이벤트가 제스처를 트리거하지 않도록 할 수 있습니다.

<Cards>
  <Card href="/react/components/pull-to-refresh#prevent-pull" title="Prevent Pull">
    PullToRefresh 컴포넌트에서 제스처를 방지할 영역을 지정하는 방법에 대해 알아봅니다.
  </Card>

  <Card href="/react/components/tabs#carousel-prevent-drag" title="Carousel Prevent Drag">
    TabsCarousel 컴포넌트에서 제스처를 방지할 영역을 지정하는 방법에 대해 알아봅니다.
  </Card>
</Cards>

<StackflowExample path="/article-prevent-pull">
  ```tsx
  import { VStack, Icon, Text, Article, Divider, PullToRefresh } from "@seed-design/react";
  import { type StaticActivityComponentType } from "@stackflow/react/future";
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
      ActivityArticlePreventPull: {};
    }
  }

  const ActivityArticlePreventPull: StaticActivityComponentType<
    "ActivityArticlePreventPull"
  > = () => {
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

  export default ActivityArticlePreventPull;
  ```
</StackflowExample>

<StackflowExample path="/article-prevent-drag">
  ```tsx
  import { VStack, Icon, Text, Article, Divider, Tabs } from "@seed-design/react";
  import { type StaticActivityComponentType } from "@stackflow/react/future";
  import { AppBar, AppBarMain } from "seed-design/ui/app-bar";
  import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
  import { TabsCarousel, TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";
  import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
  import { PageBanner } from "seed-design/ui/page-banner";

  declare module "@stackflow/config" {
    interface Register {
      ActivityArticlePreventDrag: {};
    }
  }

  const ActivityArticlePreventDrag: StaticActivityComponentType<
    "ActivityArticlePreventDrag"
  > = () => {
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

  export default ActivityArticlePreventDrag;
  ```
</StackflowExample>

### Using `asChild` or `as` prop \[#using-aschild-or-as-prop]

`<Article />`은 기본적으로 `<article>`로 렌더링되지만, `asChild` 또는 `as` prop을 사용하여 다른 요소로 변경할 수 있습니다.

<Card title="Composition" href="/react/components/concepts/composition#aschild-prop" icon="<IconComponent />">
  `asChild` prop에 대해 자세히 알아봅니다.
</Card>

```tsx
import { Article, Divider, VStack, Text } from "@seed-design/react";

export default function ArticleAs() {
  return (
    <VStack width="full" gap="x8">
      <Article
        as="section"
        display="flex"
        flexDirection="column"
        gap="spacingY.componentDefault"
        px="spacingX.globalGutter"
      >
        <Text as="h1" textStyle="t7Bold">
          `as` prop으로 Article을 section으로 변경
        </Text>
        <Text as="p" textStyle="articleBody">
          Nulla exercitation quis aliqua nostrud.
        </Text>
      </Article>
      <Divider />
      <Article
        asChild
        display="flex"
        flexDirection="column"
        gap="spacingY.componentDefault"
        px="spacingX.globalGutter"
      >
        <section>
          <Text as="h1" textStyle="t7Bold">
            `asChild` prop으로 Article을 section으로 변경
          </Text>
          <Text as="p" textStyle="articleBody">
            Elit fugiat elit exercitation laborum id veniam consequat ipsum sit voluptate velit.
          </Text>
        </section>
      </Article>
    </VStack>
  );
}
```