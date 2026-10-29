import "./styles";

import { useGlobalProps, useState } from "@lynx-js/react";
import { Box, Text, VStack } from "@seed-design/lynx-react";
import { Switch } from "@/components/ui/switch";
import {
  ChipTabsCarousel,
  ChipTabsContent,
  ChipTabsList,
  ChipTabsRoot,
  ChipTabsTrigger,
} from "@/components/ui/chip-tabs";

const ITEMS = ["전체", "동네 소식", "중고거래", "동네 생활", "가게", "모임"];

export default function Example() {
  useGlobalProps();
  const [extend, setExtend] = useState(true);
  const [center, setCenter] = useState(false);
  return (
    <VStack gap="x4" width="100%">
      <Switch checked={extend} onCheckedChange={setExtend} label="안전 영역까지 확장" />
      <Switch checked={center} onCheckedChange={setCenter} label="선택한 탭 중앙 정렬" />
      <Text textStyle="t3Regular" color="fg.neutralSubtle">
        좌우 안전 영역이 있는 기기에서 목록의 처음과 끝을 비교해 보세요.
      </Text>
      <Box pl="safeArea" pr="safeArea">
        <ChipTabsRoot defaultValue="0" extendSafeAreaX={extend}>
          <ChipTabsList scrollAlign={center ? "center" : "nearest"}>
            {ITEMS.map((label, index) => (
              <ChipTabsTrigger key={label} value={String(index)}>
                {label}
              </ChipTabsTrigger>
            ))}
          </ChipTabsList>
          <ChipTabsCarousel swipeable style={{ height: "120px" }}>
            {ITEMS.map((label, index) => (
              <ChipTabsContent key={label} value={String(index)}>
                <Box px="spacingX.globalGutter" py="x4">
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
