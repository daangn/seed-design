import IconChevronRightLine from "@karrotmarket/lynx-monochrome-icon/IconChevronRightLine";
import { Box, SuffixIcon, VStack } from "@seed-design/lynx-react";
import type { LynxPlaygroundExample } from "../../../../docs/playground/lynx/types";
import { formatLynxExampleName } from "../utils/lynx-example.js";
import { List, ListButtonItem } from "@/components/ui/list";
import { ListHeader } from "@/components/ui/list-header";

interface DocsComponentPageProps {
  component: string;
  examples: readonly LynxPlaygroundExample[];
  onOpenExample: (example: LynxPlaygroundExample) => void;
}

export function DocsComponentPage({ component, examples, onOpenExample }: DocsComponentPageProps) {
  const sortedExamples = [...examples].sort((a, b) => {
    if (a.scenario === "preview") return -1;
    if (b.scenario === "preview") return 1;
    return a.scenario.localeCompare(b.scenario);
  });

  return (
    <scroll-view scroll-orientation="vertical" className="flex-1 min-h-0 bg-bg-layer-basement">
      <VStack px="x4" py="x5" gap="x2" align="stretch">
        <ListHeader variant="mediumWeak">{formatLynxExampleName(component)}</ListHeader>
        {sortedExamples.length > 0 ? (
          <Box py="x1_5" borderRadius="r3_5" bg="bg.layerDefault">
            <List>
              {sortedExamples.map((example) => (
                <ListButtonItem
                  key={example.id}
                  title={formatLynxExampleName(example.scenario)}
                  detail={example.scenario}
                  suffix={<SuffixIcon icon={<IconChevronRightLine />} />}
                  bindtap={() => onOpenExample(example)}
                />
              ))}
            </List>
          </Box>
        ) : (
          <text className="t4-regular text-fg-neutral-subtle">검색 결과가 없습니다.</text>
        )}
      </VStack>
    </scroll-view>
  );
}
