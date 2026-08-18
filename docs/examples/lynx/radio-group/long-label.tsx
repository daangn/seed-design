import { root } from "@lynx-js/react";
import { RadioGroup, VStack, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

const label =
  "Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla.";

function Item({ value }: { value: string }) {
  return (
    <RadioGroup.Item value={value}>
      <RadioGroup.ItemControl>
        <RadioGroup.ItemIndicator />
      </RadioGroup.ItemControl>
      <RadioGroup.ItemLabel>{label}</RadioGroup.ItemLabel>
    </RadioGroup.Item>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <VStack className="radio-group-preview" gap="x5">
        <RadioGroup.Root defaultValue="medium" size="medium" tone="neutral">
          <Item value="medium" />
        </RadioGroup.Root>
        <RadioGroup.Root defaultValue="large" size="large" tone="neutral">
          <Item value="large" />
        </RadioGroup.Root>
      </VStack>
    </page>
  );
}

root.render(<Root />);
