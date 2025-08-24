import { VStack } from "@seed-design/react";
import { Switch } from "seed-design/ui/switch";

export default function SwitchDisabled() {
  return (
    <VStack gap="spacingY.componentDefault">
      <Switch disabled label="라벨" />
      <Switch checked disabled label="라벨" />
    </VStack>
  );
}
