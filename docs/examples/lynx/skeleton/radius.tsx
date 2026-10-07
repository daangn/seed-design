import { HStack, Skeleton } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <HStack
      gap="x4"
      align="center"
      justify="center"
      style={{ display: "flex", flexWrap: "wrap", maxWidth: "100%" }}
    >
      <Skeleton radius="0" width="48px" height="48px" />
      <Skeleton radius="8" width="48px" height="48px" />
      <Skeleton radius="16" width="48px" height="48px" />
      <Skeleton radius="full" width="48px" height="48px" />
    </HStack>
  );
}
