import "./styles";

import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { TagGroupRoot, TagGroupItem } from "@/components/ui/tag-group";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
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
    </page>
  );
}

root.render(<Root />);
