import "./styles";
import { root } from "@lynx-js/react";
import { RadioGroup, VStack, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="radio-group-preview">
        <RadioGroup.Root defaultValue="apple" size="large" tone="brand">
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
      </VStack>
    </page>
  );
}

root.render(<Root />);
