import { VStack } from "@seed-design/react";
import { useState } from "react";
import { Switch } from "seed-design/ui/switch";

export default function SwitchDisabled() {
  const [disabled, setDisabled] = useState(true);

  return (
    <VStack gap="x8" align="center">
      <VStack align="flex-start" gap="spacingY.componentDefault">
        <Switch disabled={disabled} label="Not Checked (Brand)" />
        <Switch disabled={disabled} defaultChecked label="Checked (Brand)" />
        <Switch disabled={disabled} label="Not Checked (Neutral)" tone="neutral" />
        <Switch disabled={disabled} defaultChecked label="Checked (Neutral)" tone="neutral" />
      </VStack>
      <Switch
        size="16"
        checked={disabled}
        onCheckedChange={setDisabled}
        label="Disable switches"
        tone="neutral"
      />
    </VStack>
  );
}
