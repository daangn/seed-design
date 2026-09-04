import "./styles";

import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { TagGroupRoot, TagGroupItem } from "@/components/ui/tag-group";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
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
    </page>
  );
}

root.render(<Root />);
