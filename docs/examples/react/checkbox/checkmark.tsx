import { HStack, Text, VStack } from "@seed-design/react";
import { Checkbox } from "@seed-design/react";
import { Checkmark } from "@/registry/ui/checkbox";

function CustomCheckbox({ children, ...props }: Checkbox.RootProps) {
  return (
    <Checkbox.Root {...props}>
      <VStack gap="x2" align="center">
        <Checkmark />
        <Checkbox.HiddenInput />
        {children}
      </VStack>
    </Checkbox.Root>
  );
}

export default function CheckboxCheckmark() {
  return (
    <HStack gap="x6">
      <CustomCheckbox>
        <Text textStyle="t7Regular">regular</Text>
      </CustomCheckbox>
      <CustomCheckbox defaultChecked>
        <Text textStyle="t7Medium">medium</Text>
      </CustomCheckbox>
      <CustomCheckbox>
        <Text textStyle="t7Bold">bold</Text>
      </CustomCheckbox>
    </HStack>
  );
}
