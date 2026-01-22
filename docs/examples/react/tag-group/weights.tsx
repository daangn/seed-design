import { VStack } from "@seed-design/react";
import { TagGroupRoot, TagGroupItem } from "seed-design/ui/tag-group";

export default function TagGroupWeights() {
  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <TagGroupRoot weight="regular">
        <TagGroupItem label="regular" />
        <TagGroupItem label="regular" />
        <TagGroupItem label="regular" />
      </TagGroupRoot>
      <TagGroupRoot weight="bold">
        <TagGroupItem label="bold" />
        <TagGroupItem label="bold" />
        <TagGroupItem label="bold" />
      </TagGroupRoot>
    </VStack>
  );
}
