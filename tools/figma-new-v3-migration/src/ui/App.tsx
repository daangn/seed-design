import { Flex } from "@seed-design/react";
import { ScanButton } from "common/components/scan-button";
import { TargetBadges } from "common/components/taget-badges";
import { MigrationProvider, useMigration, type AvailableSteps } from "common/context/migration";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";
import { events } from "shared/event";
import type { FigmaMetadata } from "shared/types";
import { ColorsSection } from "./colors";
import { TypographySection } from "./typography";
import { StartCallout } from "common/components/start-callout";

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
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
          </TabsList>

          <TabsContent
            style={{
              height: "calc(100% - var(--tabs-list-height))" /* TabsList 높이를 뺀 값 */,
            }}
            value="colors"
          >
            {targets.length > 0 ? <ColorsSection /> : <StartCallout />}
          </TabsContent>
          <TabsContent
            style={{
              height: "calc(100% - var(--tabs-list-height))",
            }}
            value="typography"
          >
            {targets.length > 0 ? <TypographySection /> : <StartCallout />}
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
