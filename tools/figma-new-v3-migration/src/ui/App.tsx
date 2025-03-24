import { Badge, Box, Flex, Text } from "@seed-design/react";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { events } from "../shared/event";
import type { FigmaMetadata } from "../shared/types";
import { ColorsSection } from "./colors";
import { MigrationProvider, useMigration } from "./context/migration";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "./seed-design/ui/tabs";

// FigmaMetadata 컨텍스트
interface FigmaMetadataContextType {
  metadata: FigmaMetadata | null;
}

const FigmaMetadataContext = createContext<FigmaMetadataContextType | null>(null);

function FigmaMetadataProvider({ children }: { children: ReactNode }) {
  const [metadata, setMetadata] = useState<FigmaMetadata | null>(null);

  useEffect(() => {
    const unsubscribe = events("send-figma-metadata").on((data) => {
      setMetadata(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <FigmaMetadataContext.Provider value={{ metadata }}>{children}</FigmaMetadataContext.Provider>
  );
}

// 섹션 컴포넌트
function TextStylesSection() {
  return (
    <Box style={{ padding: "16px" }}>
      <Text fontWeight="bold" style={{ fontSize: "16px", marginBottom: "16px" }}>
        텍스트 스타일 마이그레이션
      </Text>
      <Text style={{ fontSize: "14px" }}>
        텍스트 스타일을 선택하고 마이그레이션을 진행해주세요.
      </Text>
    </Box>
  );
}

function Steps() {
  const { targets } = useMigration();

  return (
    <Flex direction="column" height="100%" style={{ overflow: "hidden" }}>
      <Flex direction="column" height="full" style={{ overflow: "hidden" }}>
        {/* 상단 헤더 영역 */}
        <Flex borderBottomWidth={1} borderColor="palette.gray200" padding="x2" gap="x2">
          <Flex gap="x1" alignItems="center">
            <Text fontSize="t1">마이그레이션 대상 레이어</Text>
            {targets.map((target) => (
              <Badge
                tone="neutral"
                style={{ cursor: "pointer" }}
                onClick={() => events("focus-node").emit({ nodeIds: [target.id] })}
                key={target.id}
              >
                {target.name}
              </Badge>
            ))}
          </Flex>
        </Flex>

        {/* 탭 네비게이션 */}
        <TabsRoot stickyList defaultValue="colors" style={{ height: "calc(100% - 40px)" }}>
          <TabsList>
            <TabsTrigger value="colors">컬러</TabsTrigger>
            <TabsTrigger value="text-styles">텍스트 스타일</TabsTrigger>
          </TabsList>

          <TabsContent
            style={{
              height: "calc(100% - var(--tabs-list-height))" /* TabsList 높이를 뺀 값 */,
            }}
            value="colors"
          >
            <ColorsSection />
          </TabsContent>
          <TabsContent
            style={{
              height: "calc(100% - var(--tabs-list-height))",
            }}
            value="text-styles"
          >
            <TextStylesSection />
          </TabsContent>
        </TabsRoot>
      </Flex>
    </Flex>
  );
}

// 메인 App 컴포넌트
export default function App() {
  return (
    <FigmaMetadataProvider>
      <MigrationProvider>
        <Steps />
      </MigrationProvider>
    </FigmaMetadataProvider>
  );
}
