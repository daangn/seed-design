import { Article, Text, VStack } from "@seed-design/react";

export default function ArticlePreview() {
  return (
    <VStack asChild gap="x4">
      <Article>
        <Text as="h1" textStyle="t7Bold">
          Article 컴포넌트 미리보기
        </Text>
        <Text as="p" textStyle="articleBody">
          Article 컴포넌트는 기본적으로 article 엘리먼트로 렌더링됩니다.
        </Text>
      </Article>
    </VStack>
  );
}
