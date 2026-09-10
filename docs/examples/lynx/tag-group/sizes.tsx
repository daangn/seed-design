import "./styles";

import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { TagGroupRoot, TagGroupItem } from "@/components/ui/tag-group";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-tag-group-root`}>
      <VStack className="tag-group-preview" gap="spacingY.componentDefault">
        <TagGroupRoot size="t2" className="tag-group-preview__group">
          <TagGroupItem label="t2" />
          <TagGroupItem label="t2" />
          <TagGroupItem label="t2" />
        </TagGroupRoot>
        <TagGroupRoot size="t3" className="tag-group-preview__group">
          <TagGroupItem label="t3" />
          <TagGroupItem label="t3" />
          <TagGroupItem label="t3" />
        </TagGroupRoot>
        <TagGroupRoot size="t4" className="tag-group-preview__group">
          <TagGroupItem label="t4" />
          <TagGroupItem label="t4" />
          <TagGroupItem label="t4" />
        </TagGroupRoot>
      </VStack>
    </view>
  );
}
