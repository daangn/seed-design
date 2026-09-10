import "./styles";
import { root, useState } from "@lynx-js/react";
import { RadioGroup, VStack, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<string | null>(null);

  return (
    <page className={seedClassName}>
      <VStack className="radio-group-preview" gap="x4">
        <RadioGroup.Root
          defaultValue="apple"
          size="large"
          tone="neutral"
          onValueChange={(value) => {
            setCount((previous) => previous + 1);
            setLastValue(value);
          }}
        >
          <RadioGroup.Item value="apple">
            <RadioGroup.ItemControl>
              <RadioGroup.ItemIndicator />
            </RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>사과</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="banana">
            <RadioGroup.ItemControl>
              <RadioGroup.ItemIndicator />
            </RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>바나나</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="orange">
            <RadioGroup.ItemControl>
              <RadioGroup.ItemIndicator />
            </RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>오렌지</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </RadioGroup.Root>
        <text className="radio-group-preview__status">
          onValueChange 호출: {count}회, 마지막 값: {JSON.stringify(lastValue)}
        </text>
      </VStack>
    </page>
  );
}

root.render(<Root />);
