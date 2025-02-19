import { useFlow } from "@stackflow/react/future";
import { Inline, Stack } from "@seed-design/react";
import { Text } from "seed-design/ui/text";
import { Badge } from "@seed-design/react";
import { CATEGORIES, type Article } from "@/components/example/demo/data";
import { ArticleAuthor } from "@/components/example/demo/components/article-author";
import { formatDate } from "@/components/example/demo/utils/date";

type ArticleProps = Article & {};

export function ArticleListItem(article: ArticleProps) {
  const { title, content, author, categoryId, createdAt, isPopular } = article;
  const categoryName = CATEGORIES.find((c) => c.id === categoryId)?.name;
  const { push } = useFlow();

  return (
    <Stack
      as="button"
      onClick={() => push("demo/article-detail", { article })}
      style={{ textAlign: "start" }}
      gap="x2_5"
      paddingX="spacingX.globalGutter"
      paddingY="x1"
    >
      <Inline justifyContent="spaceBetween" alignItems="center">
        <ArticleAuthor author={author} />
      </Inline>
      <Stack gap="x2">
        <Stack gap="x1">
          <Text as="h1" textStyle="t5Bold" color="fg.neutral" maxLines={1}>
            {title}
          </Text>
          <Text as="p" textStyle="t4Regular" color="fg.neutralMuted" maxLines={2}>
            {content}
          </Text>
        </Stack>
        <Inline alignItems="center" gap="x2">
          {isPopular && (
            <Badge variant="outline" tone="brand">
              인기
            </Badge>
          )}
          <Text textStyle="t4Regular" color="fg.neutralSubtle">
            {categoryName} ⸱ 서초2동 ⸱ {formatDate(createdAt)}
          </Text>
        </Inline>
      </Stack>
    </Stack>
  );
}
