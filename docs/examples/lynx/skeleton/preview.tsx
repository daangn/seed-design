import { Skeleton, VStack } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <VStack gap="x4" align="center" width="full" style={{ maxWidth: "250px" }}>
      <Skeleton radius="full" width="48px" height="48px" />
      <VStack gap="x2" align="center" width="full">
        <Skeleton radius="8" width="250px" height="16px" style={{ maxWidth: "100%" }} />
        <Skeleton radius="8" width="250px" height="16px" style={{ maxWidth: "100%" }} />
      </VStack>
    </VStack>
  );
}
