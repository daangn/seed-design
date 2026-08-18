import { root } from "@lynx-js/react";
import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import { Checkbox, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Item({
  label,
  variant = "square",
  checked,
}: {
  label: string;
  variant?: Checkbox.RootProps["variant"];
  checked: boolean;
}) {
  return (
    <Checkbox.Root checked={checked} disabled variant={variant} tone="neutral" size="large">
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
      <view className="checkbox-preview">
        <Checkbox.Group>
          <Item checked label="Disabled Checked, Square" />
          <Item checked={false} label="Disabled without Checked, Square" />
          <Item checked variant="ghost" label="Disabled Checked, Ghost" />
          <Item checked={false} variant="ghost" label="Disabled without Checked, Ghost" />
        </Checkbox.Group>
      </view>
    </page>
  );
}

root.render(<Root />);
