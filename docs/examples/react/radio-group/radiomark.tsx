import { HStack, Text, VStack } from "@seed-design/react";
import { Radiomark } from "seed-design/ui/radio-group";
import { RadioGroup } from "@seed-design/react/primitive";

function CustomRadioGroupItem({ children, ...props }: RadioGroup.ItemProps) {
  return (
    <VStack asChild gap="x2" align="center">
      <RadioGroup.Item {...props}>
        <Radiomark tone="neutral" />
        <RadioGroup.ItemHiddenInput />
        {children}
      </RadioGroup.Item>
    </VStack>
  );
}

export default function RadioGroupRadiomark() {
  return (
    <VStack p="x6">
      <RadioGroup.Root defaultValue="medium" aria-label="Weight selection">
        <HStack gap="x6">
          <CustomRadioGroupItem value="regular">
            <Text textStyle="t7Regular">regular</Text>
          </CustomRadioGroupItem>
          <CustomRadioGroupItem value="medium">
            <Text textStyle="t7Medium">medium</Text>
          </CustomRadioGroupItem>
          <CustomRadioGroupItem value="bold">
            <Text textStyle="t7Bold">bold</Text>
          </CustomRadioGroupItem>
        </HStack>
      </RadioGroup.Root>
    </VStack>
  );
}
