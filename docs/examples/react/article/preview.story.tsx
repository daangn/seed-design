"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Article, Text, VStack } from "@seed-design/react";

function ArticlePreview({
  lang,
  children,
}: {
  /** 추론된 언어에 따라 단어 내 줄바꿈(word-break) 동작이 달라집니다 */
  lang?: "ko" | "en" | "ja";
  children?: string;
}) {
  return (
    <VStack asChild gap="x2" width="400px">
      <Article lang={lang}>
        <Text as="p" textStyle="articleBody">
          Article은 일관된 selection 및 줄바꿈 정책을 사용할 수 있게 돕는 유틸리티 컴포넌트입니다.
        </Text>
        <Text as="p" textStyle="articleBody">
          {children}
        </Text>
      </Article>
    </VStack>
  );
}

export const story = defineStory({
  Component: withStoryPreview()(ArticlePreview),
  args: {
    initial: {
      children: "여기를 드래그해서 선택해보세요.",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
