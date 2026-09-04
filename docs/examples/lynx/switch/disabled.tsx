import "./styles";

import { root, useState } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { Switch, type SwitchProps } from "@/components/ui/switch";

function SwitchItem({
  disabled,
  label,
  tone = "brand",
  defaultChecked = false,
}: {
  disabled: boolean;
  label: string;
  tone?: SwitchProps["tone"];
  defaultChecked?: boolean;
}) {
  return <Switch disabled={disabled} tone={tone} defaultChecked={defaultChecked} label={label} />;
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [disabled, setDisabled] = useState(true);
  return (
    <page className={seedClassName}>
      <VStack className="switch-preview" gap="x8">
        <VStack gap="spacingY.componentDefault">
          <SwitchItem disabled={disabled} label="Not Checked (Brand)" />
          <SwitchItem disabled={disabled} defaultChecked label="Checked (Brand)" />
          <SwitchItem disabled={disabled} tone="neutral" label="Not Checked (Neutral)" />
          <SwitchItem disabled={disabled} tone="neutral" defaultChecked label="Checked (Neutral)" />
        </VStack>
        <Switch
          size="16"
          tone="neutral"
          checked={disabled}
          onCheckedChange={setDisabled}
          label="Disable switches"
        />
      </VStack>
    </page>
  );
}

root.render(<Root />);
