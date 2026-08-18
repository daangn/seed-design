import { root } from "@lynx-js/react";
import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import { Checkbox, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Item({ label, variant }: { label: string; variant: Checkbox.RootProps["variant"] }) {
  return (
    <Checkbox.Root variant={variant} tone="brand" size="large" defaultChecked>
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
          <Item label="Square (default)" variant="square" />
          <Item label="Ghost" variant="ghost" />
        </Checkbox.Group>
      </view>
    </page>
  );
}

root.render(<Root />);
