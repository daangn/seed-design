import "./styles";

import { root } from "@lynx-js/react";
import { TagGroup, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="tag-group-preview">
        <view className="tag-group-preview__wrapping-container">
          <TagGroup.Root className="tag-group-preview__wrapping-group">
            <TagGroup.Item>
              <TagGroup.ItemLabel>부산광역시 해운대구</TagGroup.ItemLabel>
            </TagGroup.Item>
            <TagGroup.Item>
              <TagGroup.ItemLabel>인증 5회</TagGroup.ItemLabel>
            </TagGroup.Item>
            <TagGroup.Item>
              <TagGroup.ItemLabel>3분 전</TagGroup.ItemLabel>
            </TagGroup.Item>
          </TagGroup.Root>
        </view>
      </view>
    </page>
  );
}

root.render(<Root />);
