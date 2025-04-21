import { Flex, Skeleton } from "@seed-design/react";

export default function SkeletonRadius() {
  return (
    <Flex gap="x4" align="center">
      <Skeleton radius="0" width="x12" height="x12" />
      <Skeleton radius="8" width="x12" height="x12" />
      <Skeleton radius="16" width="x12" height="x12" />
      <Skeleton radius="full" width="x12" height="x12" />
    </Flex>
  );
}
