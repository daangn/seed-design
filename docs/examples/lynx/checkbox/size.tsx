import { root } from "@lynx-js/react";
import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import { Checkbox, HStack, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function CheckboxItem({
  label,
  size,
  variant = "square",
}: {
  label: string;
  size: Checkbox.RootProps["size"];
  variant?: Checkbox.RootProps["variant"];
}) {
  return (
    <Checkbox.Root size={size} variant={variant} tone="neutral" defaultChecked>
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
        <Checkbox.Group>
          <CheckboxItem label="Medium (default)" size="medium" />
          <CheckboxItem label="Large" size="large" />
        </Checkbox.Group>
        <Checkbox.Group>
          <CheckboxItem label="Medium (default)" size="medium" variant="ghost" />
          <CheckboxItem label="Large" size="large" variant="ghost" />
        </Checkbox.Group>
      </HStack>
    </page>
  );
}

root.render(<Root />);
