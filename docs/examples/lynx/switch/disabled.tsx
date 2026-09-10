import { root, useState } from "@lynx-js/react";
import { Switch, VStack, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function SwitchItem({
  disabled,
  label,
  tone = "brand",
  defaultChecked = false,
}: {
  disabled: boolean;
  label: string;
  tone?: Switch.RootProps["tone"];
  defaultChecked?: boolean;
}) {
  return (
    <Switch.Root disabled={disabled} tone={tone} defaultChecked={defaultChecked}>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Label>{label}</Switch.Label>
    </Switch.Root>
  );
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
        <Switch.Root size="16" tone="neutral" checked={disabled} onCheckedChange={setDisabled}>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <Switch.Label>Disable switches</Switch.Label>
        </Switch.Root>
      </VStack>
    </page>
  );
}

root.render(<Root />);
