import { root } from "@lynx-js/react";
import { TagGroup, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Item({ label }: { label: string }) {
  return (
    <TagGroup.Item>
      <TagGroup.ItemLabel>{label}</TagGroup.ItemLabel>
    </TagGroup.Item>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <view className="tag-group-preview">
        <TagGroup.Root>
          <Item label="500m" />
          <Item label="서초4동" />
          <Item label="3분 전" />
        </TagGroup.Root>
      </view>
    </page>
  );
}

root.render(<Root />);
