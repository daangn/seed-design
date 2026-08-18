import { root } from "@lynx-js/react";
import { TagGroup, VStack, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <VStack className="tag-group-preview" gap="x2">
        <text className="tag-group-preview__title">default (item 단위 wrap)</text>
        <view className="tag-group-preview__constrained">
          <TagGroup.Root>
            <TagGroup.Item>
              <TagGroup.ItemLabel>부산광역시 해운대구</TagGroup.ItemLabel>
            </TagGroup.Item>
            <TagGroup.Item flexShrink={0}>
              <TagGroup.ItemLabel>123 456 789</TagGroup.ItemLabel>
            </TagGroup.Item>
            <TagGroup.Item>
              <TagGroup.ItemLabel>Ut minim laboris enim</TagGroup.ItemLabel>
            </TagGroup.Item>
          </TagGroup.Root>
        </view>
      </VStack>
    </page>
  );
}

root.render(<Root />);
