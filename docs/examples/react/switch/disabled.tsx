import { VStack } from "@seed-design/react";
import { Switch } from "@/registry/ui/switch";

export default function SwitchDisabled() {
  return (
    <VStack align="center" gap="spacingY.componentDefault">
      <Switch disabled label="Not Checked" />
      <Switch checked disabled label="Checked" />
    </VStack>
  );
}
