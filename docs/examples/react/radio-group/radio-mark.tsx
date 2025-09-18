import { HStack, Text, VStack } from "@seed-design/react";
import { RadioMark } from "seed-design/ui/radio-group";
import { RadioGroup } from "@seed-design/react";

function CustomRadioGroupItem({ children, ...props }: RadioGroup.ItemProps) {
  return (
    <RadioGroup.Item {...props}>
      <VStack gap="x2" align="center">
        <RadioMark />
        <RadioGroup.ItemHiddenInput />
        {children}
      </VStack>
    </RadioGroup.Item>
  );
}

export default function RadioGroupRadioMark() {
  return (
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
  );
}
