import { root } from "@lynx-js/react";
import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import { Checkbox, HStack, VStack, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function CustomCheckbox({
  label,
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <Checkbox.Root defaultChecked={defaultChecked}>
      <VStack gap="x2" align="center">
        <Checkbox.Control tone="neutral">
          <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
        </Checkbox.Control>
        <text>{label}</text>
      </VStack>
    </Checkbox.Root>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <HStack className="checkbox-preview" gap="x6">
        <CustomCheckbox label="regular" />
        <CustomCheckbox label="medium" defaultChecked />
        <CustomCheckbox label="bold" />
      </HStack>
    </page>
  );
}

root.render(<Root />);
