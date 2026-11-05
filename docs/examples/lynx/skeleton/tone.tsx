import { Skeleton, VStack } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <VStack gap="x4" align="center" width="full" style={{ maxWidth: "320px" }}>
      <Skeleton tone="neutral" radius="16" width="full" height="48px" />
      <Skeleton tone="magic" radius="16" width="full" height="48px" />
    </VStack>
  );
}
