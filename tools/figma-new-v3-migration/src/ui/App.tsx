import { ActionButton, Box, Flex, LinkContent, Text } from "@seed-design/react";
import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { events } from "../shared/event";
import type { FigmaMetadata } from "../shared/types";
import { MigrationProvider, useMigration } from "./context/migration";
import { Callout } from "./seed-design/ui/callout";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "./seed-design/ui/tabs";

// 간단한 Tooltip 컴포넌트
function Tooltip({ children, content }: { children: ReactNode; content: string }) {
  return <div title={content}>{children}</div>;
}

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

function ColorsSection() {
  return (
    <Box style={{ padding: "16px" }}>
      <Text fontWeight="bold" style={{ fontSize: "16px", marginBottom: "16px" }}>
        컬러 마이그레이션
      </Text>
      <Text style={{ fontSize: "14px" }}>컬러를 선택하고 마이그레이션을 진행해주세요.</Text>
    </Box>
  );
}

function Steps() {
  const { currentStep, targets, selections } = useMigration();

  const isSelectionsAndTargetsEqual = useMemo(() => {
    if (targets.length !== selections.length) {
      return false;
    }

    return targets.every((target) => selections.some((selection) => selection.id === target.id));
  }, [targets, selections]);

  return (
    <Flex direction="column" height="100%">
      {(!currentStep || targets.length === 0) && (
        <Callout tone="informative" description="마이그레이션할 레이어를 선택해주세요." />
      )}

      {currentStep && targets.length > 0 && (
        <Flex flexDirection="column">
          <Box>
            <Flex gap="x1" alignItems="center">
              <Text fontSize="t1">마이그레이션 대상 레이어</Text>
              {targets.map((target) => (
                <LinkContent
                  size="t4"
                  onClick={() => events("focus-node").emit({ nodeIds: [target.id] })}
                  key={target.id}
                >
                  {target.name}
                </LinkContent>
              ))}
            </Flex>

            {!isSelectionsAndTargetsEqual && selections.length > 0 && (
              <Flex style={{ gap: "6px", alignItems: "center" }}>
                <Text style={{ fontSize: "14px", color: "var(--seed-scale-color-neutral-600)" }}>
                  포커싱 된 레이어
                </Text>
                {selections.length === 1 ? (
                  <Tooltip content="레이어 검사">
                    <ActionButton
                      size="small"
                      onClick={() =>
                        events("request-announce-target").emit({ nodeIds: [selections[0].id] })
                      }
                      style={{
                        maxWidth: "160px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "12px",
                      }}
                    >
                      {selections[0].name}
                    </ActionButton>
                  </Tooltip>
                ) : (
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "var(--seed-scale-color-neutral-600)",
                      fontSize: "14px",
                    }}
                  >
                    여러 개
                  </Text>
                )}
              </Flex>
            )}
          </Box>

          <TabsRoot defaultValue={currentStep?.value}>
            <TabsList>
              <TabsTrigger value="colors">컬러</TabsTrigger>
              <TabsTrigger value="text-styles">텍스트 스타일</TabsTrigger>
            </TabsList>

            <TabsContent value="colors">
              <ColorsSection />
            </TabsContent>
            <TabsContent value="text-styles">
              <TextStylesSection />
            </TabsContent>
          </TabsRoot>
        </Flex>
      )}
    </Flex>
  );
}

// 메인 App 컴포넌트
export default function App() {
  return (
    <Box height="100%">
      <FigmaMetadataProvider>
        <MigrationProvider>
          <Steps />
        </MigrationProvider>
      </FigmaMetadataProvider>
    </Box>
  );
}
