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
      <VStack className="radio-group-preview" gap="x3">
        <text className="radio-group-preview__title">좋아하는 과일</text>
        <text className="radio-group-preview__description">좋아하는 과일을 선택해 주세요.</text>
        <RadioGroup.Root defaultValue="apple" tone="neutral" size="large">
          <Item value="apple" label="Apple" />
          <Item value="banana" label="Banana" />
          <Item value="orange" label="Orange" />
        </RadioGroup.Root>
      </VStack>
    </page>
  );
}

root.render(<Root />);
