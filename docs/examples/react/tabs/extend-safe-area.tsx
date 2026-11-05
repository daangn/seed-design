import { useState } from "react";
import { Box, Text, VStack } from "@seed-design/react";
import { Switch } from "seed-design/ui/switch";
import { TabsRoot, TabsList, TabsTrigger, TabsContent, TabsCarousel } from "seed-design/ui/tabs";

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
        <TabsRoot defaultValue="0" extendSafeAreaX={extend} triggerLayout="hug">
          <TabsList>
            {items.map((label, index) => (
              <TabsTrigger key={label} value={String(index)}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsCarousel swipeable>
            {items.map((label, index) => (
              <TabsContent key={label} value={String(index)}>
                <Box px="spacingX.globalGutter" py="x6">
                  <Text>{label} 콘텐츠</Text>
                </Box>
              </TabsContent>
            ))}
          </TabsCarousel>
        </TabsRoot>
      </Box>
    </VStack>
  );
}
