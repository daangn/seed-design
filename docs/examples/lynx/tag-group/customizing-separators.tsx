import "./styles";

import { root } from "@lynx-js/react";
import { TagGroup, VStack, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="tag-group-preview" gap="spacingY.componentDefault">
        <TagGroup.Root separator=" | " size="t4" className="tag-group-preview__group">
          <TagGroup.Item>
            <TagGroup.ItemLabel>가</TagGroup.ItemLabel>
          </TagGroup.Item>
          <TagGroup.Item>
            <TagGroup.ItemLabel>나</TagGroup.ItemLabel>
          </TagGroup.Item>
          <TagGroup.Item>
            <TagGroup.ItemLabel>다</TagGroup.ItemLabel>
          </TagGroup.Item>
        </TagGroup.Root>
        <TagGroup.Root separator=" / " size="t4" className="tag-group-preview__group">
          <TagGroup.Item>
            <TagGroup.ItemLabel>서울</TagGroup.ItemLabel>
          </TagGroup.Item>
          <TagGroup.Item>
            <TagGroup.ItemLabel>서초구</TagGroup.ItemLabel>
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
