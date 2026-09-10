import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { TagGroupRoot, TagGroupItem } from "@/components/ui/tag-group";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-tag-group-root`}>
      <view className="tag-group-preview">
        <TagGroupRoot className="tag-group-preview__group">
          <TagGroupItem label="500m" />
          <TagGroupItem label="서초4동" />
          <TagGroupItem label="3분 전" />
        </TagGroupRoot>
      </view>
    </view>
  );
}
