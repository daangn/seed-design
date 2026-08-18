import { root } from "@lynx-js/react";
import { TagGroup, VStack, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Group({ size }: { size: TagGroup.RootProps["size"] }) {
  return (
    <TagGroup.Root size={size}>
      <TagGroup.Item>
        <TagGroup.ItemLabel>{size}</TagGroup.ItemLabel>
      </TagGroup.Item>
      <TagGroup.Item>
        <TagGroup.ItemLabel>{size}</TagGroup.ItemLabel>
      </TagGroup.Item>
      <TagGroup.Item>
        <TagGroup.ItemLabel>{size}</TagGroup.ItemLabel>
      </TagGroup.Item>
    </TagGroup.Root>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <VStack className="tag-group-preview" gap="spacingY.componentDefault">
        <Group size="t2" />
        <Group size="t3" />
        <Group size="t4" />
      </VStack>
    </page>
  );
}

root.render(<Root />);
