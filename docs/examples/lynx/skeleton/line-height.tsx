import { useState } from "@lynx-js/react";
import { Skeleton, Text, VStack } from "@seed-design/lynx-react";
import { Switch } from "@/components/ui/switch";

export default function Example() {
  const [loading, setLoading] = useState(true);

  return (
    <VStack gap="x4" align="center" width="full" style={{ maxWidth: "250px" }}>
      <VStack gap="x2" align="center" width="full">
        {loading ? (
          <Skeleton height="lineHeight.t7" width="200px" style={{ maxWidth: "100%" }} />
        ) : (
          <Text textStyle="t7Bold">콘텐츠 제목</Text>
        )}
        {loading ? (
          <Skeleton height="lineHeight.t4" width="250px" style={{ maxWidth: "100%" }} />
        ) : (
          <Text textStyle="t4Regular">불러온 콘텐츠입니다.</Text>
        )}
      </VStack>
      <Switch label="로딩 중" checked={loading} onCheckedChange={setLoading} />
    </VStack>
  );
}
