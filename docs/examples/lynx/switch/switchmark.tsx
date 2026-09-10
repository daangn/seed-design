import { root } from "@lynx-js/react";
import { HStack, Switch, VStack, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function CustomSwitch({
  label,
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <Switch.Root defaultChecked={defaultChecked}>
      <VStack gap="x2" align="center">
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <text>{label}</text>
      </VStack>
    </Switch.Root>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <HStack className="switch-preview" gap="x6">
        <CustomSwitch label="regular" />
        <CustomSwitch label="medium" defaultChecked />
        <CustomSwitch label="bold" />
      </HStack>
    </page>
  );
}

root.render(<Root />);
