import { root } from "@lynx-js/react";
import { HStack, RadioGroup, VStack, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Item({ value, label }: { value: string; label: string }) {
  return (
    <RadioGroup.Item value={value}>
      <VStack gap="x2" align="center">
        <RadioGroup.ItemControl tone="neutral">
          <RadioGroup.ItemIndicator />
        </RadioGroup.ItemControl>
        <text>{label}</text>
      </VStack>
    </RadioGroup.Item>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <view className="radio-group-preview">
        <RadioGroup.Root defaultValue="medium">
          <HStack gap="x6">
            <Item value="regular" label="regular" />
            <Item value="medium" label="medium" />
            <Item value="bold" label="bold" />
          </HStack>
        </RadioGroup.Root>
      </view>
    </page>
  );
}

root.render(<Root />);
