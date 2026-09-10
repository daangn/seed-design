import "./styles";

import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { Switch, type SwitchProps } from "@/components/ui/switch";

function SwitchItem({ size, label }: { size: SwitchProps["size"]; label: string }) {
  return <Switch size={size} label={label} defaultChecked />;
}

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={`${seedClassName} docs-lynx-switch-root`}>
      <VStack className="switch-preview" gap="spacingY.componentDefault">
        <SwitchItem size="32" label="32 (default)" />
        <SwitchItem size="24" label="24" />
        <SwitchItem size="16" label="16" />
      </VStack>
    </view>
  );
}
