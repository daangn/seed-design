import { VStack } from "@seed-design/react";
import { TagGroupRoot, TagGroupItem } from "seed-design/ui/tag-group";

export default function TagGroupTones() {
  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <TagGroupRoot tone="neutralSubtle">
        <TagGroupItem label="neutralSubtle" />
        <TagGroupItem label="neutralSubtle" />
        <TagGroupItem label="neutralSubtle" />
      </TagGroupRoot>
      <TagGroupRoot tone="neutral">
        <TagGroupItem label="neutral" />
        <TagGroupItem label="neutral" />
        <TagGroupItem label="neutral" />
      </TagGroupRoot>
      <TagGroupRoot tone="brand">
        <TagGroupItem label="brand" />
        <TagGroupItem label="brand" />
        <TagGroupItem label="brand" />
      </TagGroupRoot>
    </VStack>
  );
}
