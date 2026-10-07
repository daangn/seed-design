import "./styles";

import { VStack } from "@seed-design/lynx-react";
import { TagGroupRoot, TagGroupItem } from "@/components/ui/tag-group";

export default function Example() {
  return (
    <VStack className="tag-group-preview" gap="spacingY.componentDefault">
      <TagGroupRoot separator=" | " size="t4" className="tag-group-preview__group">
        <TagGroupItem label="가" />
        <TagGroupItem label="나" />
        <TagGroupItem label="다" />
        <TagGroupItem label="라" />
      </TagGroupRoot>
      <TagGroupRoot separator=" / " size="t4" className="tag-group-preview__group">
        <TagGroupItem label="가" />
        <TagGroupItem label="나" />
        <TagGroupItem label="다" />
        <TagGroupItem label="라" />
      </TagGroupRoot>
    </VStack>
  );
}
