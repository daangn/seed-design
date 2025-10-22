import { TagGroup, VStack } from "@seed-design/react";

export default function TagGroupTones() {
  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <TagGroup.Root tone="neutralSubtle">
        <TagGroup.Item>neutralSubtle</TagGroup.Item>
        <TagGroup.Item>neutralSubtle</TagGroup.Item>
        <TagGroup.Item>neutralSubtle</TagGroup.Item>
      </TagGroup.Root>
      <TagGroup.Root tone="neutral">
        <TagGroup.Item>neutral</TagGroup.Item>
        <TagGroup.Item>neutral</TagGroup.Item>
        <TagGroup.Item>neutral</TagGroup.Item>
      </TagGroup.Root>
      <TagGroup.Root tone="brand">
        <TagGroup.Item>brand</TagGroup.Item>
        <TagGroup.Item>brand</TagGroup.Item>
        <TagGroup.Item>brand</TagGroup.Item>
      </TagGroup.Root>
    </VStack>
  );
}
