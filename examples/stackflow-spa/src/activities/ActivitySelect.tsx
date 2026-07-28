import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useState } from "react";

import { AppBar, AppBarLeft, AppBarMain, AppBarBackButton } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import {
  IconStarLine,
  IconHeartLine,
  IconDiamondLine,
  IconPlusLine,
} from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";
import { BottomSheetRoot, BottomSheetContent, BottomSheetBody } from "seed-design/ui/bottom-sheet";
import { BottomSheetFooter, Portal, Text, HStack, VStack } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";

declare module "@stackflow/config" {
  interface Register {
    ActivitySelect: {};
  }
}

const SectionTitle = ({ children }: { children: string }) => (
  <Text fontSize="t5" fontWeight="bold" color="fg.neutral">
    {children}
  </Text>
);

const ActivitySelect: StaticActivityComponentType<"ActivitySelect"> = () => {
  const [value, setValue] = useState<string[]>(["apple"]);
  const [multiValue, setMultiValue] = useState<string[]>(["apple", "banana"]);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Select</AppBarMain>
      </AppBar>
      <AppScreenContent>
        <VStack gap="x6" style={{ padding: 16 }}>
          <VStack gap="x3">
            <SectionTitle>Size</SectionTitle>
            <HStack gap="x3">
              <div style={{ width: 200 }}>
                <SelectRoot size="large" defaultValue={["apple"]}>
                  <SelectTrigger aria-label="과일 large" placeholder="과일 선택" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="apple" label="사과" prefixIcon={<IconStarLine />} />
                      <SelectItem value="banana" label="바나나" />
                      <SelectItem value="cherry" label="체리" />
                    </SelectGroup>
                  </SelectContent>
                </SelectRoot>
              </div>
              <div style={{ width: 200 }}>
                <SelectRoot size="medium" defaultValue={["apple"]}>
                  <SelectTrigger aria-label="과일 medium" placeholder="과일 선택" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="apple" label="사과" />
                      <SelectItem value="banana" label="바나나" />
                      <SelectItem value="cherry" label="체리" />
                    </SelectGroup>
                  </SelectContent>
                </SelectRoot>
              </div>
            </HStack>
          </VStack>

          <VStack gap="x3">
            <SectionTitle>With Field (Label / Description / Error)</SectionTitle>
            <HStack gap="x4" align="flex-start">
              <div style={{ width: 260 }}>
                <SelectRoot
                  label="과일"
                  description="가장 좋아하는 과일을 골라주세요"
                  required
                  showRequiredIndicator
                  defaultValue={["apple"]}
                >
                  <SelectTrigger placeholder="과일 선택" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="apple" label="사과" />
                      <SelectItem value="banana" label="바나나" />
                      <SelectItem value="cherry" label="체리" />
                    </SelectGroup>
                  </SelectContent>
                </SelectRoot>
              </div>
              <div style={{ width: 260 }}>
                <SelectRoot
                  label="배송 방법"
                  description="배송 옵션을 선택하세요"
                  invalid
                  errorMessage="배송 방법을 선택해야 해요"
                >
                  <SelectTrigger placeholder="배송 방법" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="standard" label="일반 배송" />
                      <SelectItem value="express" label="빠른 배송" />
                    </SelectGroup>
                  </SelectContent>
                </SelectRoot>
              </div>
            </HStack>
          </VStack>

          <VStack gap="x3">
            <SectionTitle>With Description & Groups & Disabled</SectionTitle>
            <div style={{ width: 260 }}>
              <SelectRoot defaultValue={["standard"]}>
                <SelectTrigger aria-label="배송" placeholder="배송 방법" />
                <SelectContent>
                  <SelectGroup label="국내">
                    <SelectItem value="standard" label="일반 배송" description="3-5일 소요" />
                    <SelectItem value="express" label="빠른 배송" description="1-2일 소요" />
                  </SelectGroup>
                  <SelectGroup label="기타">
                    <SelectItem value="pickup" label="직접 수령" />
                    <SelectItem
                      value="unavailable"
                      label="해외 배송"
                      description="현재 불가"
                      disabled
                    />
                  </SelectGroup>
                </SelectContent>
              </SelectRoot>
            </div>
          </VStack>

          <VStack gap="x3">
            <SectionTitle>Disabled / ReadOnly</SectionTitle>
            <HStack gap="x4" align="flex-start">
              <div style={{ width: 200 }}>
                <SelectRoot label="비활성" disabled defaultValue={["apple"]}>
                  <SelectTrigger placeholder="과일 선택" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="apple" label="사과" />
                      <SelectItem value="banana" label="바나나" />
                      <SelectItem value="cherry" label="체리" />
                    </SelectGroup>
                  </SelectContent>
                </SelectRoot>
              </div>
              <div style={{ width: 200 }}>
                <SelectRoot label="읽기 전용" readOnly defaultValue={["banana"]}>
                  <SelectTrigger placeholder="과일 선택" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="apple" label="사과" />
                      <SelectItem value="banana" label="바나나" />
                      <SelectItem value="cherry" label="체리" />
                    </SelectGroup>
                  </SelectContent>
                </SelectRoot>
              </div>
            </HStack>
          </VStack>

          <VStack gap="x3">
            <SectionTitle>Controlled + onValueChange</SectionTitle>
            <HStack align="center" gap="x4">
              <div style={{ width: 200 }}>
                <SelectRoot value={value} onValueChange={(next) => setValue(next)}>
                  <SelectTrigger aria-label="과일 제어" placeholder="과일 선택" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="apple" label="사과" prefixIcon={<IconHeartLine />} />
                      <SelectItem value="banana" label="바나나" />
                      <SelectItem value="cherry" label="체리" />
                    </SelectGroup>
                  </SelectContent>
                </SelectRoot>
              </div>
              <Text fontSize="t3" color="fg.neutralMuted">
                값: {value.length > 0 ? value.join(", ") : "없음"}
              </Text>
            </HStack>
          </VStack>

          <VStack gap="x3">
            <SectionTitle>Prefix Icon 우선순위 (static vs 선택 item)</SectionTitle>
            <HStack align="center" gap="x4">
              <div style={{ width: 220 }}>
                <SelectRoot>
                  <SelectTrigger
                    aria-label="prefix 우선순위"
                    placeholder="과일 선택"
                    prefixIcon={<IconStarLine />}
                  />
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="apple" label="사과" prefixIcon={<IconHeartLine />} />
                      <SelectItem value="banana" label="바나나" prefixIcon={<IconDiamondLine />} />
                      <SelectItem value="cherry" label="체리" />
                    </SelectGroup>
                  </SelectContent>
                </SelectRoot>
              </div>
              <Text fontSize="t3" color="fg.neutralMuted">
                미선택: star · 사과/바나나: 각 item 아이콘이 star를 이김 · 체리(무아이콘): static
                star로 fallback
              </Text>
            </HStack>
          </VStack>

          <VStack gap="x3">
            <SectionTitle>Multiple × Prefix Icon</SectionTitle>
            <HStack align="center" gap="x4">
              <div style={{ width: 220 }}>
                <SelectRoot multiple defaultValue={["apple"]}>
                  <SelectTrigger
                    aria-label="다중 아이콘"
                    placeholder="과일 선택"
                    prefixIcon={<IconStarLine />}
                  />
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="apple" label="사과" prefixIcon={<IconHeartLine />} />
                      <SelectItem value="banana" label="바나나" prefixIcon={<IconDiamondLine />} />
                      <SelectItem value="cherry" label="체리" prefixIcon={<IconPlusLine />} />
                    </SelectGroup>
                  </SelectContent>
                </SelectRoot>
              </div>
              <Text fontSize="t3" color="fg.neutralMuted">
                1개 선택: 그 item 아이콘 미러 · 2개 이상: static star로 복귀
              </Text>
            </HStack>
          </VStack>

          <VStack gap="x3">
            <SectionTitle>Multiple</SectionTitle>
            <HStack align="center" gap="x4">
              <div style={{ width: 200 }}>
                <SelectRoot multiple value={multiValue} onValueChange={setMultiValue}>
                  <SelectTrigger aria-label="과일 다중" placeholder="과일 선택" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="apple" label="사과" />
                      <SelectItem value="banana" label="바나나" />
                      <SelectItem value="cherry" label="체리" />
                    </SelectGroup>
                  </SelectContent>
                </SelectRoot>
              </div>
              <div style={{ width: 200 }}>
                <SelectRoot
                  multiple
                  value={multiValue}
                  onValueChange={setMultiValue}
                  formatValue={(items) => `${items.length}개 선택됨`}
                >
                  <SelectTrigger aria-label="과일 다중 포맷" placeholder="과일 선택" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="apple" label="사과" />
                      <SelectItem value="banana" label="바나나" />
                      <SelectItem value="cherry" label="체리" />
                    </SelectGroup>
                  </SelectContent>
                </SelectRoot>
              </div>
            </HStack>
          </VStack>

          <VStack gap="x3">
            <SectionTitle>Many Items (Scroll)</SectionTitle>
            <div style={{ width: 220 }}>
              <SelectRoot>
                <SelectTrigger aria-label="트랙" placeholder="트랙 선택" />
                <SelectContent>
                  <SelectGroup>
                    {Array.from({ length: 30 }, (_, i) => (
                      <SelectItem
                        key={`track-${i}`}
                        value={`track-${i}`}
                        label={`Track ${i + 1}`}
                      />
                    ))}
                  </SelectGroup>
                </SelectContent>
              </SelectRoot>
            </div>
          </VStack>

          <VStack gap="x3">
            <SectionTitle>Typeahead</SectionTitle>
            <div style={{ width: 220 }}>
              <SelectRoot>
                <SelectTrigger aria-label="타입어헤드" placeholder="과일 선택" />
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="apple" label="Apple" />
                    <SelectItem value="banana" label="Banana" />
                    <SelectItem value="cherry" label="Cherry" />
                    <SelectItem value="durian" label="Durian" />
                    <SelectItem value="elderberry" label="Elderberry" />
                    <SelectItem value="fig" label="Fig" />
                    <SelectItem value="grape" label="Grape" />
                    <SelectItem value="honeydew" label="Honeydew" />
                    <SelectItem value="kiwi" label="Kiwi" />
                    <SelectItem value="lemon" label="Lemon" />
                  </SelectGroup>
                </SelectContent>
              </SelectRoot>
            </div>
          </VStack>

          <VStack gap="x3">
            <SectionTitle>Form Integration</SectionTitle>
            <form
              style={{ display: "flex", flexDirection: "column", gap: 8, width: 220 }}
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                setSubmitted(String(data.get("fruit")));
              }}
            >
              <SelectRoot name="fruit" required>
                <SelectTrigger aria-label="과일 폼" placeholder="과일 선택" />
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="apple" label="사과" />
                    <SelectItem value="banana" label="바나나" />
                    <SelectItem value="cherry" label="체리" />
                  </SelectGroup>
                </SelectContent>
              </SelectRoot>
              <ActionButton type="submit">제출</ActionButton>
              {submitted && (
                <Text fontSize="t3" color="fg.neutralMuted">
                  제출됨: {submitted}
                </Text>
              )}
            </form>
          </VStack>

          <VStack gap="x3">
            <SectionTitle>Select in BottomSheet</SectionTitle>
            <ActionButton onClick={() => setSheetOpen(true)}>BottomSheet 열기</ActionButton>
            <BottomSheetRoot open={sheetOpen} onOpenChange={setSheetOpen}>
              <Portal>
                <BottomSheetContent
                  title="Select in BottomSheet"
                  showHandle
                  layerIndex={useActivityZIndexBase({ activityOffset: 1 })}
                >
                  <BottomSheetBody>
                    <Text>BottomSheet 내부에서 Select를 열 수 있습니다.</Text>
                  </BottomSheetBody>
                  <BottomSheetFooter>
                    <div style={{ width: "100%" }}>
                      <SelectRoot defaultValue={["apple"]}>
                        <SelectTrigger aria-label="과일 시트" placeholder="과일 선택" />
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="apple" label="사과" />
                            <SelectItem value="banana" label="바나나" />
                            <SelectItem value="cherry" label="체리" />
                          </SelectGroup>
                        </SelectContent>
                      </SelectRoot>
                    </div>
                  </BottomSheetFooter>
                </BottomSheetContent>
              </Portal>
            </BottomSheetRoot>
          </VStack>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivitySelect;
