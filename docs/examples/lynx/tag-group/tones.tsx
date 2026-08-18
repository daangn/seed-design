import { root } from "@lynx-js/react";
import { TagGroup, VStack, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Group({ tone }: { tone: TagGroup.RootProps["tone"] }) {
  return (
    <TagGroup.Root tone={tone}>
      <TagGroup.Item>
        <TagGroup.ItemLabel>{tone}</TagGroup.ItemLabel>
      </TagGroup.Item>
      <TagGroup.Item>
        <TagGroup.ItemLabel>{tone}</TagGroup.ItemLabel>
      </TagGroup.Item>
      <TagGroup.Item>
        <TagGroup.ItemLabel>{tone}</TagGroup.ItemLabel>
      </TagGroup.Item>
    </TagGroup.Root>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <VStack className="tag-group-preview" gap="spacingY.componentDefault">
        <Group tone="neutralSubtle" />
        <Group tone="neutral" />
        <Group tone="brand" />
      </VStack>
    </page>
  );
}

root.render(<Root />);
