"use client";

import { IconChevronDownFill } from "@karrotmarket/react-monochrome-icon";
import { Badge, Box, Flex, HStack, Icon, Text, VStack } from "@seed-design/react";
import { useRef } from "react";
import { ScrollAutoHide } from "seed-design/breeze/scroll-auto-hide/scroll-auto-hide";
import { Avatar } from "seed-design/ui/avatar";
import { Chip } from "seed-design/ui/chip";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";
import { TagGroupItem, TagGroupRoot } from "seed-design/ui/tag-group";

type Article = {
  author: string;
  title: string;
  content: string;
  category: string;
  date: string;
  popular?: boolean;
};

const ARTICLES = [
  {
    author: "magna",
    title: "독서 습관 만들기",
    content: "하루 10페이지부터 시작하자. 취침 전 20분 독서는 수면의 질도 높여줘요.",
    category: "라이프스타일",
    date: "12월 4일",
    popular: true,
  },
  {
    author: "ullamco",
    title: "알프스 하이킹 가이드",
    content: "그린델발트에서 시작해 아이거 북벽을 감상하는 초보자용 코스를 소개해요.",
    category: "여행",
    date: "10월 15일",
  },
  {
    author: "consectetur",
    title: "커피 브루잉 팁",
    content: "물 온도 92도, 중간 분쇄도와 3분의 추출 시간이 기본이에요.",
    category: "음식",
    date: "9월 25일",
  },
  {
    author: "exercitation",
    title: "실내 공기 정화 식물",
    content: "관리하기 쉽고 공기 정화 능력이 뛰어난 식물을 모아봤어요.",
    category: "라이프스타일",
    date: "8월 7일",
  },
  {
    author: "elit",
    title: "아침 루틴의 힘",
    content: "따뜻한 물 한 잔과 가벼운 스트레칭으로 하루를 시작해보세요.",
    category: "라이프스타일",
    date: "7월 28일",
    popular: true,
  },
] satisfies Article[];

const FILTERS = ["카테고리", "동네", "작성자", "작성 시간"];

export default function ScrollAutoHidePreview() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      width="360px"
      borderWidth={1}
      borderColor="stroke.neutralMuted"
      borderRadius="r3"
      bg="bg.layerDefault"
      overflowX="hidden"
      overflowY="hidden"
    >
      <Box as="header" px="spacingX.globalGutter" py="x4">
        <Text textStyle="t6Bold" color="fg.neutral">
          Demo
        </Text>
      </Box>

      <TabsRoot defaultValue="recommendations" size="medium" triggerLayout="fill">
        <TabsList>
          <TabsTrigger value="recommendations">추천</TabsTrigger>
          <TabsTrigger value="subscriptions">구독</TabsTrigger>
        </TabsList>
      </TabsRoot>

      <Box
        ref={scrollContainerRef}
        data-testid="scroll-auto-hide-container"
        height="360px"
        overflowY="auto"
      >
        <ScrollAutoHide
          scrollContainerRef={scrollContainerRef}
          data-testid="scroll-auto-hide-root"
          asChild
        >
          <Flex
            gap="spacingX.betweenChips"
            px="spacingX.globalGutter"
            py="x4"
            bg="bg.layerDefault"
            overflowX="auto"
            style={{ zIndex: 1 }}
          >
            {FILTERS.map((filter) => (
              <Chip.Button key={filter} size="small">
                <Chip.Label>{filter}</Chip.Label>
                <Chip.SuffixIcon>
                  <Icon svg={<IconChevronDownFill />} />
                </Chip.SuffixIcon>
              </Chip.Button>
            ))}
          </Flex>
        </ScrollAutoHide>

        <VStack as="ul" gap="x5" px="spacingX.globalGutter" py="x4">
          {ARTICLES.map((article) => (
            <Box as="li" key={article.title}>
              <VStack gap="x2_5">
                <HStack gap="x1_5" align="center">
                  <Avatar fallback={<IdentityPlaceholder identity="person" />} size="20" />
                  <Text textStyle="t4Medium" color="fg.neutral">
                    {article.author}
                  </Text>
                </HStack>

                <VStack gap="x2">
                  <VStack gap="x1">
                    <Text as="h3" textStyle="t5Bold" color="fg.neutral" maxLines={1}>
                      {article.title}
                    </Text>
                    <Text as="p" textStyle="t4Regular" color="fg.neutralMuted" maxLines={2}>
                      {article.content}
                    </Text>
                  </VStack>

                  <HStack align="center" gap="x2">
                    {article.popular && (
                      <Badge variant="outline" tone="brand">
                        인기
                      </Badge>
                    )}
                    <TagGroupRoot size="t4" tone="neutralSubtle">
                      <TagGroupItem label={article.category} />
                      <TagGroupItem label="서초2동" />
                      <TagGroupItem label={article.date} />
                    </TagGroupRoot>
                  </HStack>
                </VStack>
              </VStack>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
