import { useState } from "react";
import { Box, Text, VStack } from "@seed-design/react";
import { Switch } from "seed-design/ui/switch";
import {
  ChipTabsRoot,
  ChipTabsList,
  ChipTabsTrigger,
  ChipTabsContent,
  ChipTabsCarousel,
} from "seed-design/ui/chip-tabs";

const items = ["전체", "동네 소식", "중고거래", "동네 생활", "가까운 이웃", "추천 소식"];

export default function Example() {
  const [extend, setExtend] = useState(false);
  return (
    <VStack gap="x4" width="100%">
      <Switch checked={extend} onCheckedChange={setExtend} label="안전 영역까지 확장" />
      <Text textStyle="t3Bold">
        {extend
          ? "확장 후 (TO BE) · extendSafeAreaX=true"
          : "확장 전 (AS IS) · extendSafeAreaX=false"}
      </Text>
      <Box pl="safeArea" pr="safeArea" className="docs-safe-area-frame">
        <ChipTabsRoot defaultValue="0" extendSafeAreaX={extend}>
          <ChipTabsList>
            {items.map((label, index) => (
              <ChipTabsTrigger key={label} value={String(index)}>
                {label}
              </ChipTabsTrigger>
            ))}
          </ChipTabsList>
          <ChipTabsCarousel swipeable>
            {items.map((label, index) => (
              <ChipTabsContent key={label} value={String(index)}>
                <Box px="spacingX.globalGutter" py="x6">
                  <Text>{label} 콘텐츠</Text>
                </Box>
              </ChipTabsContent>
            ))}
          </ChipTabsCarousel>
        </ChipTabsRoot>
      </Box>
    </VStack>
  );
}
