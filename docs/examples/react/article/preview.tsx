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
