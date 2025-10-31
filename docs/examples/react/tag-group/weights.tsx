import { TagGroup, VStack } from "@seed-design/react";

export default function TagGroupWeights() {
  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <TagGroup.Root weight="regular">
        <TagGroup.Item>regular</TagGroup.Item>
        <TagGroup.Item>regular</TagGroup.Item>
        <TagGroup.Item>regular</TagGroup.Item>
      </TagGroup.Root>
      <TagGroup.Root weight="bold">
        <TagGroup.Item>bold</TagGroup.Item>
        <TagGroup.Item>bold</TagGroup.Item>
        <TagGroup.Item>bold</TagGroup.Item>
      </TagGroup.Root>
    </VStack>
  );
}
