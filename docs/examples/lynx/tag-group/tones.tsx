import "./styles";

import { VStack } from "@seed-design/lynx-react";
import { TagGroupRoot, TagGroupItem } from "@/components/ui/tag-group";

export default function Example() {
  return (
    <VStack className="tag-group-preview" gap="spacingY.componentDefault">
      <TagGroupRoot tone="neutralSubtle" className="tag-group-preview__group">
        <TagGroupItem label="neutralSubtle" />
        <TagGroupItem label="neutralSubtle" />
        <TagGroupItem label="neutralSubtle" />
      </TagGroupRoot>
      <TagGroupRoot tone="neutral" className="tag-group-preview__group">
        <TagGroupItem label="neutral" />
        <TagGroupItem label="neutral" />
        <TagGroupItem label="neutral" />
      </TagGroupRoot>
      <TagGroupRoot tone="brand" className="tag-group-preview__group">
        <TagGroupItem label="brand" />
        <TagGroupItem label="brand" />
        <TagGroupItem label="brand" />
      </TagGroupRoot>
    </VStack>
  );
}
