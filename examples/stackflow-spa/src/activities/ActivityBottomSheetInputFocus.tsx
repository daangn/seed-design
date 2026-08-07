import IconHouseLine from "@karrotmarket/react-monochrome-icon/IconHouseLine";
import { Box, HStack, Text, VStack } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "seed-design/ui/bottom-sheet";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

declare module "@stackflow/config" {
  interface Register {
    ActivityBottomSheetInputFocus: {};
  }
}

const SCENARIOS = [
  {
    id: "input",
    title: "Input",
    description: "시트를 연 뒤 Input을 직접 눌러 포커스합니다.",
  },
  {
    id: "autoFocus",
    title: "진입 시 Auto focus",
    description: "시트가 열리면 Input에 자동으로 포커스합니다.",
  },
  {
    id: "autocomplete",
    title: "포커스 시 새 요소 등장",
    description: "Input에 포커스하면 아래에 자동완성 목록이 나타납니다.",
  },
  {
    id: "scroll",
    title: "내부 스크롤",
    description: "긴 목록을 스크롤한 뒤 Input 포커스와 키보드 닫기를 확인합니다.",
  },
  {
    id: "inputMiddle",
    title: "중간에 있는 Input",
    description: "Input 앞뒤에 다른 요소가 있는 상태에서 포커스합니다.",
  },
  {
    id: "inputBottom",
    title: "하단에 있는 Input",
    description: "여러 요소 아래, 시트 하단에 가까운 Input을 포커스합니다.",
  },
  {
    id: "footerInput",
    title: "하단에 고정된 Input",
    description: "BottomSheet Footer에 배치된 Input을 포커스합니다.",
  },
] as const;

const SHEET_HEIGHTS = ["40vh", "70vh"] as const;
const SUGGESTIONS = ["당근마켓", "당근알바", "당근비즈니스"] as const;
const SCROLL_ITEMS = Array.from({ length: 16 }, (_, index) => `스크롤 항목 ${index + 1}`);
const MIDDLE_BEFORE_ITEMS = ["상단 안내", "최근 검색어", "추천 검색어"] as const;
const MIDDLE_AFTER_ITEMS = ["인기 검색어", "검색 도움말"] as const;
const BOTTOM_BEFORE_ITEMS = Array.from({ length: 8 }, (_, index) => `선행 콘텐츠 ${index + 1}`);
const FOOTER_BODY_ITEMS = Array.from({ length: 6 }, (_, index) => `본문 콘텐츠 ${index + 1}`);

type Scenario = (typeof SCENARIOS)[number];
type SheetHeight = (typeof SHEET_HEIGHTS)[number];

const ActivityBottomSheetInputFocus: StaticActivityComponentType<
  "ActivityBottomSheetInputFocus"
> = () => {
  const { push } = useFlow();
  const [open, setOpen] = useState(false);
  const [scenario, setScenario] = useState<Scenario>(SCENARIOS[0]);
  const [sheetHeight, setSheetHeight] = useState<SheetHeight>(SHEET_HEIGHTS[0]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const openCase = (nextScenario: Scenario, nextHeight: SheetHeight) => {
    setScenario(nextScenario);
    setSheetHeight(nextHeight);
    setShowSuggestions(false);
    setOpen(true);
  };

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>BottomSheet Input Focus</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>

      <AppScreenContent>
        <VStack gap="x6" p="x4">
          <Text as="p" textStyle="t4Regular" color="fg.neutralMuted">
            iOS에서 키보드가 올라올 때 Bottom Sheet와 뷰포트 위치를 확인합니다.
          </Text>

          {SCENARIOS.map((item) => (
            <Box as="section" key={item.id}>
              <VStack gap="x3">
                <VStack gap="x1">
                  <Text as="h2" textStyle="t5Bold" color="fg.neutral">
                    {item.title}
                  </Text>
                  <Text as="p" textStyle="t3Regular" color="fg.neutralMuted">
                    {item.description}
                  </Text>
                </VStack>
                <HStack gap="x2">
                  {SHEET_HEIGHTS.map((height) => (
                    <ActionButton
                      key={height}
                      flexGrow
                      variant="neutralSolid"
                      onClick={() => openCase(item, height)}
                    >
                      {height} 열기
                    </ActionButton>
                  ))}
                </HStack>
              </VStack>
            </Box>
          ))}
        </VStack>
      </AppScreenContent>

      <BottomSheetRoot open={open} autoFocus={scenario.id !== "autoFocus"} onOpenChange={setOpen}>
        <BottomSheetContent
          showHandle
          showCloseButton={false}
          title={`${scenario.title} · ${sheetHeight}`}
          description={scenario.description}
          layerIndex={useActivityZIndexBase({ activityOffset: 1 })}
          style={{ minHeight: sheetHeight, maxHeight: "calc(100dvh - 48px)" }}
        >
          <BottomSheetBody
            style={{ minHeight: 0, overflowY: "auto", WebkitOverflowScrolling: "touch" }}
          >
            <VStack gap="x3">
              {scenario.id === "inputMiddle" &&
                MIDDLE_BEFORE_ITEMS.map((item) => (
                  <Box key={item} bg="bg.neutralWeak" borderRadius="r2" px="x4" py="x3">
                    <Text textStyle="t4Regular" color="fg.neutral">
                      {item}
                    </Text>
                  </Box>
                ))}

              {scenario.id === "inputBottom" &&
                BOTTOM_BEFORE_ITEMS.map((item) => (
                  <Box key={item} bg="bg.neutralWeak" borderRadius="r2" px="x4" py="x3">
                    <Text textStyle="t4Regular" color="fg.neutral">
                      {item}
                    </Text>
                  </Box>
                ))}

              {scenario.id === "footerInput" &&
                FOOTER_BODY_ITEMS.map((item) => (
                  <Box key={item} bg="bg.neutralWeak" borderRadius="r2" px="x4" py="x3">
                    <Text textStyle="t4Regular" color="fg.neutral">
                      {item}
                    </Text>
                  </Box>
                ))}

              {scenario.id !== "scroll" && scenario.id !== "footerInput" && (
                <TextField name={`search-${scenario.id}`} label="검색어">
                  <TextFieldInput
                    autoFocus={scenario.id === "autoFocus"}
                    placeholder="검색어를 입력하세요"
                    onFocus={() => {
                      if (scenario.id === "autocomplete") {
                        setShowSuggestions(true);
                      }
                    }}
                  />
                </TextField>
              )}

              {scenario.id === "autocomplete" && showSuggestions && (
                <Box
                  bg="bg.layerDefault"
                  borderColor="stroke.neutralWeak"
                  borderRadius="r2"
                  borderWidth={1}
                  overflowX="hidden"
                  overflowY="hidden"
                >
                  {SUGGESTIONS.map((suggestion) => (
                    <Box key={suggestion} px="x4" py="x3">
                      <Text textStyle="t4Regular" color="fg.neutral">
                        {suggestion}
                      </Text>
                    </Box>
                  ))}
                </Box>
              )}

              {scenario.id === "inputMiddle" &&
                MIDDLE_AFTER_ITEMS.map((item) => (
                  <Box key={item} bg="bg.neutralWeak" borderRadius="r2" px="x4" py="x3">
                    <Text textStyle="t4Regular" color="fg.neutral">
                      {item}
                    </Text>
                  </Box>
                ))}

              {scenario.id === "scroll" && (
                <>
                  <TextField name="search-scroll" label="검색어">
                    <TextFieldInput placeholder="검색어를 입력하세요" />
                  </TextField>
                  {SCROLL_ITEMS.map((item) => (
                    <Box key={item} bg="bg.neutralWeak" borderRadius="r2" px="x4" py="x3">
                      <Text textStyle="t4Regular" color="fg.neutral">
                        {item}
                      </Text>
                    </Box>
                  ))}
                </>
              )}
            </VStack>
          </BottomSheetBody>
          <BottomSheetFooter>
            {scenario.id === "footerInput" ? (
              <VStack gap="x2">
                <TextField name="search-footer" label="검색어">
                  <TextFieldInput placeholder="하단에서 검색어를 입력하세요" />
                </TextField>
                <ActionButton variant="neutralSolid" onClick={() => setOpen(false)}>
                  닫기
                </ActionButton>
              </VStack>
            ) : (
              <ActionButton variant="neutralSolid" onClick={() => setOpen(false)}>
                닫기
              </ActionButton>
            )}
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheetRoot>
    </AppScreen>
  );
};

export default ActivityBottomSheetInputFocus;
