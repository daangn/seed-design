import "./styles";

import { root } from "@lynx-js/react";
import { TagGroup, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="tag-group-preview">
        <TagGroup.Root tone="neutral" className="tag-group-preview__group">
          <TagGroup.Item tone="brand" weight="bold">
            <TagGroup.ItemLabel>NEW</TagGroup.ItemLabel>
          </TagGroup.Item>
          <TagGroup.Item>
            <TagGroup.ItemLabel>무료 나눔</TagGroup.ItemLabel>
          </TagGroup.Item>
          <TagGroup.Item tone="neutralSubtle">
            <TagGroup.ItemLabel>방금 전</TagGroup.ItemLabel>
          </TagGroup.Item>
        </TagGroup.Root>
      </view>
    </page>
  );
}

root.render(<Root />);
