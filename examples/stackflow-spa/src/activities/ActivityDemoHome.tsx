import { useState, useMemo } from "react";
import type { ActivityComponentType } from "@stackflow/react/future";
import { AppBar, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { TabsRoot, TabsTrigger, TabsList, TabsCarousel, TabsContent } from "seed-design/ui/tabs";
import { SnackbarProvider } from "seed-design/ui/snackbar";
import { ResultSection } from "seed-design/ui/result-section";
import { IconArticleFill, IconChevronDownFill } from "@karrotmarket/react-monochrome-icon";
import {
  Flex,
  HStack,
  VStack,
  Icon,
  Box,
  Text,
  Badge,
  TagGroup,
  Portal,
  Tabs,
} from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";
import {
  BottomSheetBody,
  BottomSheetRoot,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";
import { ActionButton } from "seed-design/ui/action-button";
import { Snackbar, useSnackbarAdapter } from "seed-design/ui/snackbar";
import { ARTICLES, CATEGORIES, type Article, type Category } from "../demo-data";
import { useFlow } from "@stackflow/react/future";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { formatDate } from "../utils/date";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { tabsCarouselPreventDrag } from "@seed-design/react";

declare module "@stackflow/config" {
  interface Register {
    ActivityDemoHome: {};
  }
}

const TABS = [
  { label: "추천", value: "recommendations" },
  { label: "구독", value: "subscriptions" },
] as const satisfies {
  label: string;
  value: string;
}[];

type Tab = (typeof TABS)[number]["value"];

const FILTERS = [
  { label: "카테고리", value: "category" },
  { label: "동네", value: "location" },
  { label: "작성자", value: "author" },
  { label: "작성 시간", value: "createdAt" },
] as const satisfies {
  label: string;
  value: string;
}[];

type Filter = (typeof FILTERS)[number]["value"];

const ActivityDemoHome: ActivityComponentType<"ActivityDemoHome"> = () => {
  const [tab, setTab] = useState<Tab>("recommendations");

  return (
    <SnackbarProvider>
      <style
        // biome-ignore lint/security/noDangerouslySetInnerHtml: this is for hiding scrollbar
        dangerouslySetInnerHTML={{
          __html: "::-webkit-scrollbar{display:none}",
        }}
      />
      <AppScreen>
        <AppBar>
          <AppBarMain title="Demo" />
        </AppBar>
        <AppScreenContent>
          <TabsRoot
            value={tab}
            onValueChange={(value) => setTab(value as Tab)}
            triggerLayout="fill"
            size="medium"
            stickyList
          >
            <TabsList>
              {TABS.map(({ label, value }) => (
                <TabsTrigger key={value} value={value}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsCarousel>
              <TabsContent value={TABS[0].value}>
                <Recommendations />
              </TabsContent>
              <TabsContent value={TABS[1].value}>
                <VStack py="x12">
                  <ResultSection
                    asset={
                      <Box pb="x4">
                        <Icon svg={<IconArticleFill />} size="x10" color="fg.neutralSubtle" />
                      </Box>
                    }
                    title="구독한 글이 없습니다."
                    description="추천 글을 확인해보세요."
                    primaryActionProps={{
                      children: "추천 글 보기",
                      onClick: () => setTab("recommendations"),
                    }}
                  />
                </VStack>
              </TabsContent>
            </TabsCarousel>
          </TabsRoot>
        </AppScreenContent>
      </AppScreen>
    </SnackbarProvider>
  );
};

export function Recommendations() {
  const [currentFilterBottomSheet, setCurrentFilterBottomSheet] = useState<Filter | null>(null);

  const defaultFilters = useMemo(
    () => ({
      category: [],
      location: [],
      author: [],
      createdAt: [],
    }),
    [],
  );

  const [selectedFilters, setSelectedFilters] = useState<Record<Filter, string[]>>(defaultFilters);

  const adapter = useSnackbarAdapter();

  const onUnavailableFilterClick = () =>
    adapter.create({
      render: () => (
        <Snackbar
          message="카테고리로만 필터링할 수 있어요."
          variant="critical"
          actionLabel="확인"
          onAction={adapter.dismiss}
        />
      ),
    });

  const filteredArticles = useMemo(() => {
    let filtered = ARTICLES;

    if (selectedFilters.category?.length) {
      filtered = ARTICLES.filter((article) =>
        selectedFilters.category?.includes(article.categoryId),
      );
    }

    // XXX: Add more filters if needed

    return filtered;
  }, [selectedFilters]);

  const handleFilterConfirm = (filter: Filter, values: string[]) => {
    setSelectedFilters((prev) => ({ ...prev, [filter]: values }));
  };

  return (
    <VStack gap="spacingY.componentDefault" py="x4">
      <Flex
        gap="spacingX.betweenChips"
        px="spacingX.globalGutter"
        overflowX="auto"
        {...tabsCarouselPreventDrag}
      >
        {FILTERS.map(({ label, value }) => (
          <BottomSheetRoot
            key={value}
            closeOnEscape
            closeOnInteractOutside
            open={currentFilterBottomSheet === value}
            onOpenChange={(open) => setCurrentFilterBottomSheet(open ? value : null)}
          >
            {value === "category" ? (
              <BottomSheetTrigger asChild>
                <Chip.Button onClick={value !== "category" ? onUnavailableFilterClick : undefined}>
                  <Chip.Label>
                    {selectedFilters[value]?.length
                      ? selectedFilters[value]
                          .map((id) => CATEGORIES.find((c) => c.id === id)?.name)
                          .join(", ") || label
                      : label}
                  </Chip.Label>
                  <Chip.SuffixIcon>
                    <Icon svg={<IconChevronDownFill />} />
                  </Chip.SuffixIcon>
                </Chip.Button>
              </BottomSheetTrigger>
            ) : (
              <Chip.Button onClick={onUnavailableFilterClick}>
                <Chip.Label>{label}</Chip.Label>
                <Chip.SuffixIcon>
                  <Icon svg={<IconChevronDownFill />} />
                </Chip.SuffixIcon>
              </Chip.Button>
            )}
            <Portal>
              <FilterBottomSheet
                filter={value}
                currentFilter={selectedFilters[value]}
                onClose={() => setCurrentFilterBottomSheet(null)}
                onConfirm={(values) => handleFilterConfirm(value, values)}
              />
            </Portal>
          </BottomSheetRoot>
        ))}
      </Flex>
      <VStack gap="x4" as="ul">
        {filteredArticles
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((article) => (
            <li key={article.id}>
              <ArticleListItem {...article} />
            </li>
          ))}
      </VStack>
    </VStack>
  );
}

export function FilterBottomSheet({
  filter,
  currentFilter,
  onClose,
  onConfirm,
}: {
  filter: string;
  currentFilter: string[];
  onClose: () => void;
  onConfirm: (values: string[]) => void;
}) {
  const options = useMemo(() => {
    switch (filter) {
      case "category":
        return CATEGORIES;
      // Add more cases for other filters if needed
      default:
        return [];
    }
  }, [filter]);

  const [selectedOptions, setSelectedOptions] = useState<string[]>(currentFilter);

  return (
    <BottomSheetContent
      title={FILTERS.find((f) => f.value === filter)?.label}
      layerIndex={useActivityZIndexBase({ activityOffset: 1 })}
    >
      <BottomSheetBody>
        <HStack gap="x2" wrap>
          {options.map((option: Category) => (
            <Chip.Toggle
              variant="outlineStrong"
              key={option.id}
              checked={selectedOptions.includes(option.id)}
              onCheckedChange={(checked) =>
                setSelectedOptions((prev) =>
                  checked ? [...prev, option.id] : prev.filter((id) => id !== option.id),
                )
              }
            >
              <Chip.Label>{option.name}</Chip.Label>
            </Chip.Toggle>
          ))}
        </HStack>
      </BottomSheetBody>
      <BottomSheetFooter>
        <ActionButton
          variant="neutralSolid"
          onClick={() => {
            onConfirm(selectedOptions);
            onClose();
          }}
        >
          완료
        </ActionButton>
      </BottomSheetFooter>
    </BottomSheetContent>
  );
}

type ArticleProps = Article & {};

export function ArticleListItem(article: ArticleProps) {
  const { title, content, author, categoryId, createdAt, isPopular } = article;
  const categoryName = CATEGORIES.find((c) => c.id === categoryId)?.name;
  const { push } = useFlow();

  return (
    <VStack
      as="button"
      onClick={() => push("ActivityDemoArticleDetail", { articleId: article.id })}
      style={{ textAlign: "start" }}
      gap="x2_5"
      px="spacingX.globalGutter"
      py="x1"
    >
      <HStack justify="space-between" align="center">
        <HStack gap="x1_5" align="center" flexGrow={1}>
          <Avatar
            fallback={<IdentityPlaceholder identity="person" />}
            size="20"
            style={{ zIndex: -1 }}
          />
          <Text textStyle="t4Medium" color="fg.neutral">
            {author}
          </Text>
        </HStack>
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
          <TagGroup.Root size="t4" tone="neutralSubtle">
            <TagGroup.Item>{categoryName}</TagGroup.Item>
            <TagGroup.Item>서초2동</TagGroup.Item>
            <TagGroup.Item>{formatDate(createdAt)}</TagGroup.Item>
          </TagGroup.Root>
        </HStack>
      </VStack>
    </VStack>
  );
}

export default ActivityDemoHome;
