import "./styles";

import { root } from "@lynx-js/react";
import { TagGroup as SeedTagGroup, VStack, useSeedClassName } from "@seed-design/lynx-react";
import { TagGroupRoot, TagGroupItem } from "@/components/ui/tag-group";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="tag-group-preview" gap="spacingY.componentDefault">
        <TagGroupRoot className="tag-group-preview__group">
          <SeedTagGroup.Item weight="bold" tone="neutral">
            <SeedTagGroup.ItemLabel>4.5</SeedTagGroup.ItemLabel>
          </SeedTagGroup.Item>
          <TagGroupItem label="후기 37" />
          <TagGroupItem label="단골 12" />
        </TagGroupRoot>
        <TagGroupRoot tone="neutral" className="tag-group-preview__group">
          <TagGroupItem tone="brand" label="인증됨" />
          <TagGroupItem label="10" />
          <TagGroupItem label="3" />
        </TagGroupRoot>
      </VStack>
    </page>
  );
}

root.render(<Root />);
