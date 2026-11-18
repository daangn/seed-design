import { HStack, Text, VStack, Switch } from "@seed-design/react";
import { Switchmark } from "seed-design/ui/switch";

function CustomSwitch({ children, ...props }: Switch.RootPrimitiveProps) {
  return (
    <VStack asChild gap="x2" align="center">
      <Switch.Root.Primitive {...props}>
        <Switchmark />
        <Switch.HiddenInput />
        {children}
      </Switch.Root.Primitive>
    </VStack>
  );
}

export default function () {
  return (
    <HStack gap="x6">
      <CustomSwitch>
        <Text textStyle="t7Regular">regular</Text>
      </CustomSwitch>
      <CustomSwitch defaultChecked>
        <Text textStyle="t7Medium">medium</Text>
      </CustomSwitch>
      <CustomSwitch>
        <Text textStyle="t7Bold">bold</Text>
      </CustomSwitch>
    </HStack>
  );
}
