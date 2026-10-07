import "./styles";

import { VStack } from "@seed-design/lynx-react";
import { TagGroupRoot, TagGroupItem } from "@/components/ui/tag-group";

export default function Example() {
  return (
    <VStack className="tag-group-preview" gap="spacingY.componentDefault">
      <TagGroupRoot weight="regular" className="tag-group-preview__group">
        <TagGroupItem label="regular" />
        <TagGroupItem label="regular" />
        <TagGroupItem label="regular" />
      </TagGroupRoot>
      <TagGroupRoot weight="bold" className="tag-group-preview__group">
        <TagGroupItem label="bold" />
        <TagGroupItem label="bold" />
        <TagGroupItem label="bold" />
      </TagGroupRoot>
    </VStack>
  );
}
