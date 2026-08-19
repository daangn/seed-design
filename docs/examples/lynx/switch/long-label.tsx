import { root } from "@lynx-js/react";
import { Switch, VStack, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

const label =
  "Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla.";

function SwitchItem({ size }: { size: Switch.RootProps["size"] }) {
  return (
    <Switch.Root size={size}>
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
        <SwitchItem size="32" />
        <SwitchItem size="24" />
        <SwitchItem size="16" />
      </VStack>
    </page>
  );
}

root.render(<Root />);
