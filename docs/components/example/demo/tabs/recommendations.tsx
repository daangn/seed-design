import { useMemo, useState } from "react";
import { IconChevronDownFill, IconPenHorizlineFill } from "@karrotmarket/react-monochrome-icon";
import { Flex, HStack, VStack, Icon } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";
import {
  BottomSheetBody,
  BottomSheetRoot,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";
import { ActionButton } from "seed-design/ui/action-button";
import { FloatingActionButton } from "seed-design/ui/floating-action-button";
import { Snackbar, useSnackbarAdapter } from "seed-design/ui/snackbar";
import { ARTICLES, CATEGORIES, type Category } from "@/components/example/demo/data";
import { ArticleListItem } from "@/components/example/demo/components/article-list-item";
import { List } from "seed-design/ui/list";

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
    <VStack gap="spacingY.componentDefault" pt="x4" pb="x16">
      <FloatingActionButton
        label="글쓰기"
        icon={<IconPenHorizlineFill />}
        style={{ position: "fixed", insetBlockEnd: "16px", insetInlineEnd: "16px" }}
      />
      <Flex gap="spacingX.betweenChips" px="spacingX.globalGutter" overflowX="auto">
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
            <FilterBottomSheet
              filter={value}
              currentFilter={selectedFilters[value]}
              onClose={() => setCurrentFilterBottomSheet(null)}
              onConfirm={(values) => handleFilterConfirm(value, values)}
            />
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
    <BottomSheetContent title={FILTERS.find((f) => f.value === filter)?.label}>
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
