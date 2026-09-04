import "./styles";

import { root } from "@lynx-js/react";
import { Text, VStack, useSeedClassName } from "@seed-design/lynx-react";
import { TagGroupRoot, TagGroupItem } from "@/components/ui/tag-group";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="tag-group-preview">
        <VStack className="tag-group-preview__wrapping-container" gap="x1" align="flex-start">
          <Text textStyle="t2Medium">default (wrap)</Text>
          <TagGroupRoot className="tag-group-preview__wrapping-group">
            <TagGroupItem label="부산광역시 해운대구" />
            <TagGroupItem label="123 456 789 012 345" />
            <TagGroupItem label="Ut minim laboris enim" />
          </TagGroupRoot>
        </VStack>
      </view>
    </page>
  );
}

root.render(<Root />);
