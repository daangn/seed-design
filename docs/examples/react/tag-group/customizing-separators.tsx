import { VStack } from "@seed-design/react";
import { TagGroupRoot, TagGroupItem } from "seed-design/ui/tag-group";

export default function TagGroupCustomizingSeparators() {
  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <TagGroupRoot separator=" | " size="t4">
        <TagGroupItem label="가" />
        <TagGroupItem label="나" />
        <TagGroupItem label="다" />
        <TagGroupItem label="라" />
      </TagGroupRoot>
      <TagGroupRoot separator=" " size="t4">
        <TagGroupItem label="가" />
        <TagGroupItem label="나" />
        <TagGroupItem label="다" />
        <TagGroupItem label="라" />
      </TagGroupRoot>
    </VStack>
  );
}
