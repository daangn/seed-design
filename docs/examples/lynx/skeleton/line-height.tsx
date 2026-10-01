import "./styles";

import { useState } from "@lynx-js/react";
import { Skeleton, Text, useSeedClassName, VStack } from "@seed-design/lynx-react";
import { Switch } from "@/components/ui/switch";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [loading, setLoading] = useState(true);

  return (
    <view className={`${seedClassName} docs-lynx-skeleton-root`}>
      <view className="skeleton-preview">
        <VStack gap="x4" align="center">
          <VStack gap="x2" align="flex-start">
            {loading ? (
              <Skeleton height="lineHeight.t7" width="200px" />
            ) : (
              <Text textStyle="t7Bold">콘텐츠 제목</Text>
            )}
            {loading ? (
              <Skeleton height="lineHeight.t4" width="250px" />
            ) : (
              <Text textStyle="t4Regular">불러온 콘텐츠입니다.</Text>
            )}
          </VStack>
          <Switch label="로딩 중" checked={loading} onCheckedChange={setLoading} />
        </VStack>
      </view>
    </view>
  );
}
