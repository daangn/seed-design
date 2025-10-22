import { TagGroup, VStack } from "@seed-design/react";

export default function TagGroupCustomizingItem() {
  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <TagGroup.Root separator=" | " size="t4">
        <TagGroup.Item>가</TagGroup.Item>
        <TagGroup.Item>나</TagGroup.Item>
        <TagGroup.Item>다</TagGroup.Item>
        <TagGroup.Item>라</TagGroup.Item>
      </TagGroup.Root>
      <TagGroup.Root separator=" " size="t4">
        <TagGroup.Item>가</TagGroup.Item>
        <TagGroup.Item>나</TagGroup.Item>
        <TagGroup.Item>다</TagGroup.Item>
        <TagGroup.Item>라</TagGroup.Item>
      </TagGroup.Root>
    </VStack>
  );
}
