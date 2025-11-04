import { TagGroup, VStack } from "@seed-design/react";

export default function TagGroupSizes() {
  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <TagGroup.Root size="t2">
        <TagGroup.Item>t2</TagGroup.Item>
        <TagGroup.Item>t2</TagGroup.Item>
        <TagGroup.Item>t2</TagGroup.Item>
      </TagGroup.Root>
      <TagGroup.Root size="t3">
        <TagGroup.Item>t3</TagGroup.Item>
        <TagGroup.Item>t3</TagGroup.Item>
        <TagGroup.Item>t3</TagGroup.Item>
      </TagGroup.Root>
      <TagGroup.Root size="t4">
        <TagGroup.Item>t4</TagGroup.Item>
        <TagGroup.Item>t4</TagGroup.Item>
        <TagGroup.Item>t4</TagGroup.Item>
      </TagGroup.Root>
    </VStack>
  );
}
