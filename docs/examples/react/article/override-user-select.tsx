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
