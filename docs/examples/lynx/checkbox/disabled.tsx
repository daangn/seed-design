import "./styles";

import { root } from "@lynx-js/react";
import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import { Checkbox, VStack, useSeedClassName } from "@seed-design/lynx-react";

function CheckboxItem({
  label,
  variant,
  defaultChecked = false,
}: {
  label: string;
  variant: Checkbox.RootProps["variant"];
  defaultChecked?: boolean;
}) {
  return (
    <Checkbox.Root
      tone="neutral"
      size="large"
      variant={variant}
      defaultChecked={defaultChecked}
      disabled
    >
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
      <VStack className="checkbox-preview" gap="spacingY.componentDefault">
        <CheckboxItem label="선택 안 됨, Square" variant="square" />
        <CheckboxItem label="선택됨, Square" variant="square" defaultChecked />
        <CheckboxItem label="선택 안 됨, Ghost" variant="ghost" />
        <CheckboxItem label="선택됨, Ghost" variant="ghost" defaultChecked />
      </VStack>
    </page>
  );
}

root.render(<Root />);
