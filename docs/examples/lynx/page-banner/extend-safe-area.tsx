import { useGlobalProps, useState } from "@lynx-js/react";
import { Box, Text, VStack } from "@seed-design/lynx-react";
import { Switch } from "@/components/ui/switch";
import { ActionablePageBanner, PageBanner } from "@/components/ui/page-banner";

export default function Example() {
  useGlobalProps();
  const [extend, setExtend] = useState(true);
  const [count, setCount] = useState(0);
  return (
    <VStack gap="x4" width="100%">
      <Switch checked={extend} onCheckedChange={setExtend} label="안전 영역까지 확장" />
      <Text textStyle="t3Regular" color="fg.neutralSubtle">
        배경의 경계와 내용의 위치를 비교해 보세요.
      </Text>
      <Box pl="safeArea" pr="safeArea">
        <VStack gap="x3" style={{ overflow: "visible" }}>
          <PageBanner extendSafeAreaX={extend} description="새로운 동네 소식을 확인해 보세요." />
          <ActionablePageBanner
            extendSafeAreaX={extend}
            tone="informative"
            description="눌러서 배너의 움직임을 확인해 보세요."
            bindtap={() => {
              "background only";
              setCount((value) => value + 1);
            }}
          />
          <PageBanner
            extendSafeAreaX={extend}
            tone="magic"
            description="그라데이션 배경도 화면 끝까지 이어져요."
          />
        </VStack>
      </Box>
      <Text textStyle="t3Regular">배너를 {count}번 눌렀어요.</Text>
    </VStack>
  );
}
