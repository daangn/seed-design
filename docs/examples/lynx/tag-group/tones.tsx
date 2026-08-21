import "./styles";

import { root } from "@lynx-js/react";
import { TagGroup, VStack, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="tag-group-preview" gap="spacingY.componentDefault">
        <TagGroup.Root tone="neutralSubtle" className="tag-group-preview__group">
          <TagGroup.Item>
            <TagGroup.ItemLabel>neutralSubtle</TagGroup.ItemLabel>
          </TagGroup.Item>
          <TagGroup.Item>
            <TagGroup.ItemLabel>3분 전</TagGroup.ItemLabel>
          </TagGroup.Item>
        </TagGroup.Root>
        <TagGroup.Root tone="neutral" className="tag-group-preview__group">
          <TagGroup.Item>
            <TagGroup.ItemLabel>neutral</TagGroup.ItemLabel>
          </TagGroup.Item>
          <TagGroup.Item>
            <TagGroup.ItemLabel>서초4동</TagGroup.ItemLabel>
          </TagGroup.Item>
        </TagGroup.Root>
        <TagGroup.Root tone="brand" className="tag-group-preview__group">
          <TagGroup.Item>
            <TagGroup.ItemLabel>brand</TagGroup.ItemLabel>
          </TagGroup.Item>
          <TagGroup.Item>
            <TagGroup.ItemLabel>추천</TagGroup.ItemLabel>
          </TagGroup.Item>
        </TagGroup.Root>
      </VStack>
    </page>
  );
}

root.render(<Root />);
