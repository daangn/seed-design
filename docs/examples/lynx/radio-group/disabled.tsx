import { root } from "@lynx-js/react";
import { RadioGroup, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Item({
  value,
  label,
  disabled = false,
}: {
  value: string;
  label: string;
  disabled?: boolean;
}) {
  return (
    <RadioGroup.Item value={value} disabled={disabled}>
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
        <RadioGroup.Root defaultValue="option1" tone="neutral" size="large">
          <Item value="option1" label="Active option" />
          <Item value="option2" label="Disabled option" disabled />
          <Item value="option3" label="Another active option" />
        </RadioGroup.Root>
      </view>
    </page>
  );
}

root.render(<Root />);
