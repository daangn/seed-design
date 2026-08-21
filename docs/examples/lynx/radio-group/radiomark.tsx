import "./styles";
import { root } from "@lynx-js/react";
import { HStack, RadioGroup, VStack, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="radio-group-preview">
        <RadioGroup.Root defaultValue="medium" size="large" tone="neutral">
          <HStack gap="x6">
            <RadioGroup.Item value="regular">
              <VStack gap="x2" align="center">
                <RadioGroup.ItemControl>
                  <RadioGroup.ItemIndicator />
                </RadioGroup.ItemControl>
                <RadioGroup.ItemLabel>Regular</RadioGroup.ItemLabel>
              </VStack>
            </RadioGroup.Item>
            <RadioGroup.Item value="medium">
              <VStack gap="x2" align="center">
                <RadioGroup.ItemControl>
                  <RadioGroup.ItemIndicator />
                </RadioGroup.ItemControl>
                <RadioGroup.ItemLabel>Medium</RadioGroup.ItemLabel>
              </VStack>
            </RadioGroup.Item>
            <RadioGroup.Item value="bold">
              <VStack gap="x2" align="center">
                <RadioGroup.ItemControl>
                  <RadioGroup.ItemIndicator />
                </RadioGroup.ItemControl>
                <RadioGroup.ItemLabel>Bold</RadioGroup.ItemLabel>
              </VStack>
            </RadioGroup.Item>
          </HStack>
        </RadioGroup.Root>
      </VStack>
    </page>
  );
}

root.render(<Root />);
