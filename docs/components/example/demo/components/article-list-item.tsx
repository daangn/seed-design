import { ArticleAuthor } from "@/components/example/demo/components/article-author";
import { CATEGORIES, type Article } from "@/components/example/demo/data";
import { formatDate } from "@/components/example/demo/utils/date";
import { Badge, HStack, Text, VStack } from "@seed-design/react";
import { useFlow } from "@stackflow/react/future";

type ArticleProps = Article & {};

export function ArticleListItem(article: ArticleProps) {
  const { title, content, author, categoryId, createdAt, isPopular } = article;
  const categoryName = CATEGORIES.find((c) => c.id === categoryId)?.name;
  const { push } = useFlow();

  return (
    <VStack
      as="button"
      onClick={() => push("demo/article-detail", { article })}
      style={{ textAlign: "start" }}
      gap="x2_5"
      px="spacingX.globalGutter"
      py="x1"
    >
      <HStack justify="space-between" align="center">
        <ArticleAuthor author={author} />
      </HStack>
      <VStack gap="x2">
        <VStack gap="x1">
          <Text as="h1" textStyle="t5Bold" color="fg.neutral" maxLines={1}>
            {title}
          </Text>
          <Text as="p" textStyle="t4Regular" color="fg.neutralMuted" maxLines={2}>
            {content}
          </Text>
        </VStack>
        <HStack align="center" gap="x2">
          {isPopular && (
            <Badge variant="outline" tone="brand">
              인기
            </Badge>
          )}
          <Text textStyle="t4Regular" color="fg.neutralSubtle">
            {categoryName} ⸱ 서초2동 ⸱ {formatDate(createdAt)}
          </Text>
        </HStack>
      </VStack>
    </VStack>
  );
}
