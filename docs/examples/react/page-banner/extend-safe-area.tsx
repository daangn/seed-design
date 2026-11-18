import { useState } from "react";
import { Box, Text, VStack } from "@seed-design/react";
import { Switch } from "seed-design/ui/switch";
import { PageBanner, ActionablePageBanner } from "seed-design/ui/page-banner";

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
        <VStack gap="x3">
          <PageBanner extendSafeAreaX={extend} description="새로운 동네 소식을 확인해 보세요." />
          <ActionablePageBanner
            extendSafeAreaX={extend}
            tone="informative"
            description="배경은 끝까지, 내용은 안전 영역 안에 놓입니다."
          />
          <PageBanner
            extendSafeAreaX={extend}
            tone="magic"
            description="그라데이션 배경도 화면 끝까지 이어져요."
          />
        </VStack>
      </Box>
    </VStack>
  );
}
