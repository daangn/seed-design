import { Box, Flex, Text } from "@seed-design/react";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { events } from "../shared/event";
import type { FigmaMetadata } from "../shared/types";
import { ColorsSection } from "./colors";
import { Footer } from "./components/Footer";
import { ScanButton } from "./components/ScanButton";
import { TargetBadges } from "./components/TargetBadges";
import { MigrationProvider, useMigration, type AvailableSteps } from "./context/migration";
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
  // 텍스트 스타일 검사 요청 핸들러
  const handleRefresh = () => {
    // TODO: 텍스트 스타일 검사 요청 기능 구현
    console.log("텍스트 스타일 검사 요청");
  };

  return (
    <Flex direction="column" height="full" style={{ position: "relative" }}>
      {/* 메인 컨텐츠 영역 */}
      <Box flexGrow={1} style={{ overflow: "auto", height: "calc(100% - 60px)" }}>
        <Box padding="x3">
          <Text fontWeight="bold" style={{ fontSize: "16px", marginBottom: "16px" }}>
            텍스트 스타일 마이그레이션
          </Text>
          <Text style={{ fontSize: "14px" }}>
            텍스트 스타일을 선택하고 마이그레이션을 진행해주세요.
          </Text>
        </Box>
      </Box>

      {/* 하단 푸터 */}
      <Footer
        customContent={
          <Text fontSize="t7" color="palette.gray700">
            텍스트 스타일 마이그레이션 기능은 아직 준비 중입니다.
          </Text>
        }
        onRefresh={handleRefresh}
        showRefreshButton={true}
      />
    </Flex>
  );
}

function Steps() {
  const { targets, selections } = useMigration();
  const [currentTab, setCurrentTab] = useState<AvailableSteps>("colors");

  return (
    <Flex direction="column" height="100%" style={{ overflow: "hidden" }}>
      <Flex direction="column" height="full" style={{ overflow: "hidden" }}>
        {/* 상단 헤더 영역 */}
        <Flex
          borderBottomWidth={1}
          borderColor="palette.gray200"
          paddingX="x2"
          paddingY="x1"
          gap="x2"
        >
          <Flex gap="x1" alignItems="center" flexGrow={1}>
            <TargetBadges targets={targets} />
          </Flex>
          <Flex alignItems="center">
            <ScanButton currentTab={currentTab} selections={selections} />
          </Flex>
        </Flex>

        {/* 탭 네비게이션 */}
        <TabsRoot
          stickyList
          value={currentTab}
          onValueChange={(value) => setCurrentTab(value as AvailableSteps)}
          style={{ height: "calc(100% - var(--tabs-list-height))" }}
        >
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
