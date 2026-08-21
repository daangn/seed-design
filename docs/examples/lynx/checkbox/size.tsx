import "./styles";

import { root } from "@lynx-js/react";
import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import { Checkbox, HStack, VStack, useSeedClassName } from "@seed-design/lynx-react";

function CheckboxItem({
  label,
  size,
  variant,
}: {
  label: string;
  size: Checkbox.RootProps["size"];
  variant: Checkbox.RootProps["variant"];
}) {
  return (
    <Checkbox.Root tone="neutral" size={size} variant={variant} defaultChecked>
      <Checkbox.Control>
        <Checkbox.Indicator
          unchecked={variant === "ghost" ? <IconCheckmarkFatFill /> : undefined}
          checked={<IconCheckmarkFatFill />}
        />
      </Checkbox.Control>
      <Checkbox.Label>{label}</Checkbox.Label>
    </Checkbox.Root>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <HStack className="checkbox-preview" gap="x8">
        <VStack gap="spacingY.componentDefault">
          <CheckboxItem label="Medium (default)" size="medium" variant="square" />
          <CheckboxItem label="Large" size="large" variant="square" />
        </VStack>
        <VStack gap="spacingY.componentDefault">
          <CheckboxItem label="Medium (default)" size="medium" variant="ghost" />
          <CheckboxItem label="Large" size="large" variant="ghost" />
        </VStack>
      </HStack>
    </page>
  );
}

root.render(<Root />);
