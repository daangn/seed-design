import { root, useState } from "@lynx-js/react";
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
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<string | null>(null);
  return (
    <page className={seedClassName}>
      <VStack className="radio-group-preview" gap="x4">
        <RadioGroup.Root
          defaultValue="apple"
          tone="neutral"
          size="large"
          onValueChange={(value) => {
            setCount((previous) => previous + 1);
            setLastValue(value);
          }}
        >
          <Item value="apple" label="Apple" />
          <Item value="banana" label="Banana" />
          <Item value="orange" label="Orange" />
        </RadioGroup.Root>
        <text className="radio-group-preview__status">
          onValueChange called: {count} times, last value: {lastValue ?? "-"}
        </text>
      </VStack>
    </page>
  );
}

root.render(<Root />);
