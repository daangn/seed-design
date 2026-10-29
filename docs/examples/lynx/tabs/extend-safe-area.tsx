import "./styles";

import { useGlobalProps, useState } from "@lynx-js/react";
import { Box, Text, VStack } from "@seed-design/lynx-react";
import { Switch } from "@/components/ui/switch";
import { TabsCarousel, TabsContent, TabsList, TabsRoot, TabsTrigger } from "@/components/ui/tabs";

const ITEMS = ["추천", "동네 소식", "중고거래", "동네 생활", "가게", "모임"];

export default function Example() {
  useGlobalProps();
  const [extend, setExtend] = useState(true);
  const [fill, setFill] = useState(false);
  const [center, setCenter] = useState(false);

  return (
    <VStack gap="x4" width="100%">
      <Switch checked={extend} onCheckedChange={setExtend} label="안전 영역까지 확장" />
      <Switch checked={fill} onCheckedChange={setFill} label="탭 너비 균등하게" />
      <Switch checked={center} onCheckedChange={setCenter} label="선택한 탭 중앙 정렬" />
      <Text textStyle="t3Regular" color="fg.neutralSubtle">
        좌우 안전 영역이 있는 기기에서 목록과 콘텐츠의 경계를 비교해 보세요.
      </Text>
      <Box pl="safeArea" pr="safeArea">
        <TabsRoot defaultValue="0" triggerLayout={fill ? "fill" : "hug"} extendSafeAreaX={extend}>
          <TabsList scrollAlign={center ? "center" : "nearest"}>
            {ITEMS.map((label, index) => (
              <TabsTrigger key={label} value={String(index)}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsCarousel swipeable style={{ height: "120px" }}>
            {ITEMS.map((label, index) => (
              <TabsContent key={label} value={String(index)}>
                <Box px="spacingX.globalGutter" py="x4">
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
