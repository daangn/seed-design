import { root } from "@lynx-js/react";
import { RadioGroup, VStack, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Item({ value, label }: { value: string; label: string }) {
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
        <RadioGroup.Root defaultValue="apple" size="medium" tone="neutral">
          <Item value="apple" label="사과" />
          <Item value="banana" label="바나나" />
          <Item value="orange" label="오렌지" />
        </RadioGroup.Root>
        <RadioGroup.Root defaultValue="red" size="large" tone="neutral">
          <Item value="red" label="빨간색" />
          <Item value="blue" label="파란색" />
          <Item value="green" label="초록색" />
        </RadioGroup.Root>
      </VStack>
    </page>
  );
}

root.render(<Root />);
