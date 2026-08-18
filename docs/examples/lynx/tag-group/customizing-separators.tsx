import { root } from "@lynx-js/react";
import { TagGroup, VStack, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Group({ separator }: { separator: string }) {
  return (
    <TagGroup.Root separator={separator} size="t4">
      <TagGroup.Item>
        <TagGroup.ItemLabel>가</TagGroup.ItemLabel>
      </TagGroup.Item>
      <TagGroup.Item>
        <TagGroup.ItemLabel>나</TagGroup.ItemLabel>
      </TagGroup.Item>
      <TagGroup.Item>
        <TagGroup.ItemLabel>다</TagGroup.ItemLabel>
      </TagGroup.Item>
      <TagGroup.Item>
        <TagGroup.ItemLabel>라</TagGroup.ItemLabel>
      </TagGroup.Item>
    </TagGroup.Root>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <VStack className="tag-group-preview" gap="spacingY.componentDefault">
        <Group separator=" | " />
        <Group separator=" " />
      </VStack>
    </page>
  );
}

root.render(<Root />);
