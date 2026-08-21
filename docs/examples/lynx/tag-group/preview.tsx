import "./styles";

import { root } from "@lynx-js/react";
import { TagGroup, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="tag-group-preview">
        <TagGroup.Root className="tag-group-preview__group">
          <TagGroup.Item>
            <TagGroup.ItemLabel>500m</TagGroup.ItemLabel>
          </TagGroup.Item>
          <TagGroup.Item>
            <TagGroup.ItemLabel>서초4동</TagGroup.ItemLabel>
          </TagGroup.Item>
          <TagGroup.Item>
            <TagGroup.ItemLabel>3분 전</TagGroup.ItemLabel>
          </TagGroup.Item>
        </TagGroup.Root>
      </view>
    </page>
  );
}

root.render(<Root />);
