import { root } from "@lynx-js/react";
import { RadioGroup, useSeedClassName } from "@seed-design/lynx-react";
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
      <view className="radio-group-preview">
        <RadioGroup.Root defaultValue="apple" tone="brand" size="large">
          <Item value="apple" label="사과" />
          <Item value="banana" label="바나나" />
          <Item value="orange" label="오렌지" />
        </RadioGroup.Root>
      </view>
    </page>
  );
}

root.render(<Root />);
