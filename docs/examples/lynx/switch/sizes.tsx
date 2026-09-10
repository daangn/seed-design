import { root } from "@lynx-js/react";
import { Switch, VStack, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function SwitchItem({ size, label }: { size: Switch.RootProps["size"]; label: string }) {
  return (
    <Switch.Root size={size} defaultChecked>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Label>{label}</Switch.Label>
    </Switch.Root>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <VStack className="switch-preview" gap="spacingY.componentDefault">
        <SwitchItem size="32" label="32 (default)" />
        <SwitchItem size="24" label="24" />
        <SwitchItem size="16" label="16" />
      </VStack>
    </page>
  );
}

root.render(<Root />);
