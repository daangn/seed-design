import { VStack } from "@seed-design/react";
import { Switch } from "seed-design/ui/switch";

export default function SwitchSizes() {
  return (
    <VStack align="center" gap="spacingY.componentDefault">
      <Switch size="32" label="32 (default)" defaultChecked />
      <Switch size="24" label="24" defaultChecked />
      <Switch size="16" label="16" defaultChecked />
    </VStack>
  );
}
