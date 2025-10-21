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
