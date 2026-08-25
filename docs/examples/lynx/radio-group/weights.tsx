import "./styles";
import { root } from "@lynx-js/react";
import { RadioGroup, VStack, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="radio-group-preview" gap="x5">
        <RadioGroup.Root defaultValue="regular-1" size="large" tone="neutral" weight="regular">
          <RadioGroup.Item value="regular-1">
            <RadioGroup.ItemControl>
              <RadioGroup.ItemIndicator />
            </RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>Regular</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="regular-2">
            <RadioGroup.ItemControl>
              <RadioGroup.ItemIndicator />
            </RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>Regular</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </RadioGroup.Root>
        <RadioGroup.Root defaultValue="bold-1" size="large" tone="neutral" weight="bold">
          <RadioGroup.Item value="bold-1">
            <RadioGroup.ItemControl>
              <RadioGroup.ItemIndicator />
            </RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>Bold</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="bold-2">
            <RadioGroup.ItemControl>
              <RadioGroup.ItemIndicator />
            </RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>Bold</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </RadioGroup.Root>
      </VStack>
    </page>
  );
}

root.render(<Root />);
