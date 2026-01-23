import { HStack, Text, VStack } from "@seed-design/react";
import { Checkbox } from "@seed-design/react/primitive";
import { Checkmark } from "seed-design/ui/checkbox";

function CustomCheckbox({ children, ...props }: Checkbox.RootProps) {
  return (
    <VStack asChild gap="x2" align="center">
      <Checkbox.Root {...props}>
        <Checkmark tone="neutral" />
        <Checkbox.HiddenInput />
        {children}
      </Checkbox.Root>
    </VStack>
  );
}

export default function CheckboxCheckmark() {
  return (
    <HStack gap="x6" p="x6">
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
