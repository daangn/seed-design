import { root } from "@lynx-js/react";
import { TagGroup, VStack, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Group({ weight }: { weight: TagGroup.RootProps["weight"] }) {
  return (
    <TagGroup.Root weight={weight}>
      <TagGroup.Item>
        <TagGroup.ItemLabel>{weight}</TagGroup.ItemLabel>
      </TagGroup.Item>
      <TagGroup.Item>
        <TagGroup.ItemLabel>{weight}</TagGroup.ItemLabel>
      </TagGroup.Item>
      <TagGroup.Item>
        <TagGroup.ItemLabel>{weight}</TagGroup.ItemLabel>
      </TagGroup.Item>
    </TagGroup.Root>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <VStack className="tag-group-preview" gap="spacingY.componentDefault">
        <Group weight="regular" />
        <Group weight="bold" />
      </VStack>
    </page>
  );
}

root.render(<Root />);
