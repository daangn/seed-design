import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useState } from "react";

import { AppBar, AppBarLeft, AppBarMain, AppBarBackButton } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { IconStarLine, IconHeartLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
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
  const [value, setValue] = useState<string | null>("apple");
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
                <SelectRoot size="large" defaultValue="apple">
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
                <SelectRoot size="medium" defaultValue="apple">
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
            <SectionTitle>With Description & Groups & Disabled</SectionTitle>
            <div style={{ width: 260 }}>
              <SelectRoot defaultValue="standard">
                <SelectTrigger aria-label="배송" placeholder="배송 방법" />
                <SelectContent>
                  <SelectGroup>
                    <SelectGroupLabel>국내</SelectGroupLabel>
                    <SelectItem value="standard" label="일반 배송" description="3-5일 소요" />
                    <SelectItem value="express" label="빠른 배송" description="1-2일 소요" />
                  </SelectGroup>
                  <SelectGroup>
                    <SelectGroupLabel>기타</SelectGroupLabel>
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
                값: {value ?? "없음"}
              </Text>
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
                      <SelectRoot defaultValue="apple">
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
