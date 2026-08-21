import "./styles";

import { root } from "@lynx-js/react";
import { TagGroup, VStack, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="tag-group-preview" gap="spacingY.componentDefault">
        <TagGroup.Root weight="regular" className="tag-group-preview__group">
          <TagGroup.Item>
            <TagGroup.ItemLabel>regular</TagGroup.ItemLabel>
          </TagGroup.Item>
          <TagGroup.Item>
            <TagGroup.ItemLabel>서초4동</TagGroup.ItemLabel>
          </TagGroup.Item>
        </TagGroup.Root>
        <TagGroup.Root weight="bold" className="tag-group-preview__group">
          <TagGroup.Item>
            <TagGroup.ItemLabel>bold</TagGroup.ItemLabel>
          </TagGroup.Item>
          <TagGroup.Item>
            <TagGroup.ItemLabel>서초4동</TagGroup.ItemLabel>
          </TagGroup.Item>
        </TagGroup.Root>
      </VStack>
    </page>
  );
}

root.render(<Root />);
