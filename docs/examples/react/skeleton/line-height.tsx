import { ActionButton, Skeleton, Text, VStack } from "@seed-design/react";
import { useState } from "react";

export default function SkeletonLineHeight() {
  const [loading, setLoading] = useState(true);

  return (
    <VStack gap="x4" width="full">
      <VStack gap="x2" alignItems="flex-start">
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
      <ActionButton variant="neutralWeak" onClick={() => setLoading((prev) => !prev)}>
        {loading ? "콘텐츠 보기" : "Skeleton 보기"}
      </ActionButton>
    </VStack>
  );
}
