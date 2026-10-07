import "./styles";

import { HStack, Switch, Text, VStack } from "@seed-design/lynx-react";
import { Switchmark } from "@/components/ui/switch";

interface CustomSwitchProps extends Switch.RootProps {
  label: string;
  textStyle: "t7Regular" | "t7Medium" | "t7Bold";
}

function CustomSwitch({ label, textStyle, ...props }: CustomSwitchProps) {
  return (
    <Switch.Root accessibility-label={label} {...props}>
      <VStack gap="x2" align="center">
        <Switchmark />
        <Text textStyle={textStyle}>{label}</Text>
      </VStack>
    </Switch.Root>
  );
}

export default function Example() {
  return (
    <HStack className="switch-preview" gap="x6">
      <CustomSwitch label="regular" textStyle="t7Regular" />
      <CustomSwitch label="medium" textStyle="t7Medium" defaultChecked />
      <CustomSwitch label="bold" textStyle="t7Bold" />
    </HStack>
  );
}
