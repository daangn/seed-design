import { CATEGORIES, type Article } from "@/components/example/demo/data";
import type { ActivityComponentType } from "@stackflow/react/future";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import {
  AppBar,
  AppBarBackButton,
  AppBarCloseButton,
  AppBarRight,
  AppBarLeft,
} from "seed-design/ui/app-bar";
import { Stack, Columns, Column, Box } from "@seed-design/react";
import { Text } from "@seed-design/react";
import { Badge } from "@seed-design/react";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { Callout } from "seed-design/ui/callout";
import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";
import { ErrorState } from "seed-design/ui/error-state";
import { ActionButton } from "seed-design/ui/action-button";
import { Skeleton } from "@seed-design/react";
import { IconILowercaseSerifCircleFill } from "@daangn/react-monochrome-icon";
import { ArticleAuthor } from "./components/article-author";
import { formatDate } from "@/components/example/demo/utils/date";
import { useState } from "react";

import img from "@/public/penguin.webp";

declare module "@stackflow/config" {
  interface Register {
    "demo/article-detail": {
      article: Article;
    };
  }
}

const SEGMENTS = [
  { value: "popular", label: "인기" },
  { value: "latest", label: "최근" },
] as const satisfies { value: string; label: string }[];

const DemoArticleDetail: ActivityComponentType<"demo/article-detail"> = ({
  params: { article },
}) => {
  const categoryName = CATEGORIES.find((c) => c.id === article.categoryId)?.name;
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <AppScreen layerOffsetTop="none">
      <AppBar tone="transparent">
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarRight>
          <AppBarCloseButton />
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <Stack gap="x4">
          <Box style={{ aspectRatio: "1 / 1", position: "relative" }}>
            <img
              src={img.src}
              alt="penguin"
              onLoad={() => setIsImageLoading(false)}
              style={{ position: "absolute", zIndex: 1 }}
            />
            {isImageLoading && <Skeleton width="full" height="full" radius="0" />}
          </Box>
          <Stack gap="x6" paddingBottom="x4">
            <Stack
              paddingX="spacingX.globalGutter"
              gap="spacingY.componentDefault"
              alignItems="flexStart"
            >
              {article.isPopular && (
                <Badge variant="outline" tone="brand" size="large">
                  인기
                </Badge>
              )}
              <Stack gap="x1">
                <Text as="h1" textStyle="t7Bold" color="fg.neutral">
                  {article.title}
                </Text>
                <Text
                  as="p"
                  textStyle="articleBody"
                  color="fg.neutralMuted"
                  style={{ wordBreak: "keep-all" }}
                >
                  {article.content}
                </Text>
              </Stack>
              <Columns width="full" alignItems="center">
                <Column>
                  <ArticleAuthor author={article.author} />
                </Column>
                <Column width="content">
                  <Text textStyle="t2Regular" color="fg.neutralMuted">
                    {categoryName} ⸱ {formatDate(article.createdAt)}
                  </Text>
                </Column>
              </Columns>
            </Stack>
            <Stack paddingX="spacingX.globalGutter" gap="spacingY.componentDefault">
              <Callout
                tone="neutral"
                description="따뜻한 댓글을 남겨주세요."
                prefixIcon={<IconILowercaseSerifCircleFill />}
              />
              <SegmentedControl
                aria-label="댓글 정렬 방식"
                defaultValue={SEGMENTS[0].value}
                style={{ width: "100%" }}
              >
                {SEGMENTS.map((tab) => (
                  <SegmentedControlItem key={tab.value} value={tab.value}>
                    {tab.label}
                  </SegmentedControlItem>
                ))}
              </SegmentedControl>
              <Box paddingY="x3">
                <ErrorState title="댓글 없음" description="댓글이 없습니다." />
              </Box>
              <TextField label="댓글" maxGraphemeCount={200}>
                <TextFieldTextarea placeholder="저는…" />
              </TextField>
              <ActionButton>게시</ActionButton>
            </Stack>
          </Stack>
        </Stack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default DemoArticleDetail;
