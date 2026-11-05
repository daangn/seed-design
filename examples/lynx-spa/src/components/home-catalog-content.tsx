import IconChevronRightLine from "@karrotmarket/lynx-monochrome-icon/IconChevronRightLine";
import { Box, SuffixIcon, VStack } from "@seed-design/lynx-react";
import type { LynxPlaygroundExample } from "../../../../docs/playground/lynx/types";
import type { HomeCategory, LegacyPage, LegacySection } from "../pages/home-navigation.js";
import { formatLynxExampleName } from "../utils/lynx-example.js";
import { List, ListButtonItem } from "@/components/ui/list";
import { ListHeader } from "@/components/ui/list-header";

interface HomeCatalogContentProps {
  category: HomeCategory;
  examples: readonly LynxPlaygroundExample[];
  catalogIsEmpty: boolean;
  legacySections: readonly LegacySection[];
  onOpenComponent: (component: string) => void;
  onOpenLegacy: (page: LegacyPage) => void;
}

export function HomeCatalogContent({
  category,
  examples,
  catalogIsEmpty,
  legacySections,
  onOpenComponent,
  onOpenLegacy,
}: HomeCatalogContentProps) {
  return (
    <VStack className="mt-4" px="spacingX.globalGutter" gap="x2" align="stretch">
      {category === "docs" ? (
        <DocumentationCatalog
          examples={examples}
          catalogIsEmpty={catalogIsEmpty}
          onOpenComponent={onOpenComponent}
        />
      ) : (
        <LegacyCatalog sections={legacySections} onOpenLegacy={onOpenLegacy} />
      )}
    </VStack>
  );
}

interface DocumentationCatalogProps {
  examples: readonly LynxPlaygroundExample[];
  catalogIsEmpty: boolean;
  onOpenComponent: (component: string) => void;
}

function DocumentationCatalog({
  examples,
  catalogIsEmpty,
  onOpenComponent,
}: DocumentationCatalogProps) {
  const groupedExamples = new Map<string, LynxPlaygroundExample[]>();
  for (const example of examples) {
    const group = groupedExamples.get(example.component) ?? [];
    group.push(example);
    groupedExamples.set(example.component, group);
  }

  if (groupedExamples.size === 0) {
    return (
      <CatalogEmptyState
        message={catalogIsEmpty ? "등록된 문서 예제가 없습니다." : "검색 결과가 없습니다."}
      />
    );
  }

  return (
    <VStack gap="x1" align="stretch">
      <ListHeader variant="boldSolid">문서 예제</ListHeader>
      <Box borderRadius="r3_5" bg="bg.layerDefault">
        <List>
          {[...groupedExamples.entries()].map(([component, componentExamples]) => (
            <ListButtonItem
              key={component}
              title={formatLynxExampleName(component)}
              detail={`예제 ${componentExamples.length}개`}
              suffix={<SuffixIcon icon={<IconChevronRightLine />} />}
              bindtap={() => onOpenComponent(component)}
            />
          ))}
        </List>
      </Box>
    </VStack>
  );
}

interface LegacyCatalogProps {
  sections: readonly LegacySection[];
  onOpenLegacy: (page: LegacyPage) => void;
}

function LegacyCatalog({ sections, onOpenLegacy }: LegacyCatalogProps) {
  if (sections.length === 0) return <CatalogEmptyState message="검색 결과가 없습니다." />;

  return (
    <>
      {sections.map((section) => (
        <VStack key={section.title} gap="x2" align="stretch">
          <ListHeader variant="boldSolid">{section.title}</ListHeader>
          <Box borderRadius="r3_5" bg="bg.layerDefault">
            <List>
              {section.items.map((item) => (
                <ListButtonItem
                  key={item.page}
                  title={item.title}
                  detail={item.page}
                  suffix={<SuffixIcon icon={<IconChevronRightLine />} />}
                  bindtap={() => onOpenLegacy(item.page)}
                />
              ))}
            </List>
          </Box>
        </VStack>
      ))}
    </>
  );
}

function CatalogEmptyState({ message }: { message: string }) {
  return <text className="t4-regular text-fg-neutral-subtle">{message}</text>;
}
