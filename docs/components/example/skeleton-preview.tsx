import { Skeleton, VStack } from "@seed-design/react";

export default function SkeletonPreview() {
  return (
    <VStack gap="x4" align="center">
      <Skeleton radius="full" width="x12" height="x12" />
      <VStack direction="column" gap="x2">
        <Skeleton radius="8" height="x4" width="250px" />
        <Skeleton radius="8" height="x4" width="250px" />
      </VStack>
    </VStack>
  );
}
