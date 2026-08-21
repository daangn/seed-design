import "./styles";
import { root } from "@lynx-js/react";
import { RadioGroup, VStack, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="radio-group-preview" gap="x5">
        <RadioGroup.Root defaultValue="apple" size="medium" tone="neutral">
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
        </RadioGroup.Root>
        <RadioGroup.Root defaultValue="red" size="large" tone="neutral">
          <RadioGroup.Item value="red">
            <RadioGroup.ItemControl>
              <RadioGroup.ItemIndicator />
            </RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>빨간색</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="blue">
            <RadioGroup.ItemControl>
              <RadioGroup.ItemIndicator />
            </RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>파란색</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </RadioGroup.Root>
      </VStack>
    </page>
  );
}

root.render(<Root />);
