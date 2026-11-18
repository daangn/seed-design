import { HStack, Text, VStack, Checkbox } from "@seed-design/react";
import { Checkmark } from "seed-design/ui/checkbox";

function CustomCheckbox({ children, ...props }: Checkbox.RootPrimitiveProps) {
  return (
    <VStack asChild gap="x2" align="center">
      <Checkbox.Root.Primitive {...props}>
        <Checkmark tone="neutral" />
        <Checkbox.HiddenInput />
        {children}
      </Checkbox.Root.Primitive>
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
