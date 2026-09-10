import "./styles";

import { HStack, Text, VStack, useSeedClassName } from "@seed-design/lynx-react";
import { Switchmark } from "@/components/ui/switch";

interface CustomSwitchProps {
  label: string;
  textStyle: "t7Regular" | "t7Medium" | "t7Bold";
  defaultChecked?: boolean;
}

function CustomSwitch({ label, textStyle, defaultChecked = false }: CustomSwitchProps) {
  return (
    <VStack gap="x2" align="center">
      <Switchmark accessibility-label={label} defaultChecked={defaultChecked} />
      <Text textStyle={textStyle}>{label}</Text>
    </VStack>
  );
}

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={`${seedClassName} docs-lynx-switch-root`}>
      <HStack className="switch-preview" gap="x6">
        <CustomSwitch label="regular" textStyle="t7Regular" />
        <CustomSwitch label="medium" textStyle="t7Medium" defaultChecked />
        <CustomSwitch label="bold" textStyle="t7Bold" />
      </HStack>
    </view>
  );
}
