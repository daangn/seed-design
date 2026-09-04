import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { TagGroupRoot, TagGroupItem } from "@/components/ui/tag-group";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="tag-group-preview">
        <TagGroupRoot className="tag-group-preview__group">
          <TagGroupItem label="500m" />
          <TagGroupItem label="서초4동" />
          <TagGroupItem label="3분 전" />
        </TagGroupRoot>
      </view>
    </page>
  );
}

root.render(<Root />);
