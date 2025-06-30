import { Box, Skeleton, VStack } from "@seed-design/react";

export default function SkeletonTone() {
  return (
    <VStack gap="x4" alignItems="flex-start" width="full">
      <Skeleton tone="neutral" radius="16" width="full" height="x12" />
      <Skeleton tone="magic" radius="16" width="full" height="x12" />
    </VStack>
  );
}
