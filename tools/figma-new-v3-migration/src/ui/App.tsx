import { Flex } from "@seed-design/react";
import { ScanButton } from "common/components/scan-button";
import { StartCallout } from "common/components/start-callout";
import { TargetBadges } from "common/components/taget-badges";
import { MigrationProvider, useMigration, type AvailableSteps } from "common/context/migration";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";
import { events } from "shared/event";
import type { FigmaMetadata } from "shared/types";
import { ColorSection } from "./color-section";
import { ComponentSection } from "./component-section";
import { TypographySection } from "./typography-section";

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

function Steps() {
  const { targets, selections, loading, currentTab, setCurrentTab, scanCurrentTab } =
    useMigration();

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
            <ScanButton selections={selections} isLoading={loading} onScan={scanCurrentTab} />
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
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
          </TabsList>

          <TabsContent
            style={{
              height: "calc(100% - var(--tabs-list-height))" /* TabsList 높이를 뺀 값 */,
            }}
            value="colors"
          >
            {targets.length > 0 ? <ColorSection /> : <StartCallout />}
          </TabsContent>
          <TabsContent
            style={{
              height: "calc(100% - var(--tabs-list-height))",
            }}
            value="typography"
          >
            {targets.length > 0 ? <TypographySection /> : <StartCallout />}
          </TabsContent>
          <TabsContent
            style={{
              height: "calc(100% - var(--tabs-list-height))",
            }}
            value="components"
          >
            {targets.length > 0 ? <ComponentSection /> : <StartCallout />}
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
