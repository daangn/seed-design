import { root } from "@lynx-js/react";
import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import { Checkbox, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Item({ label, weight }: { label: string; weight: Checkbox.RootProps["weight"] }) {
  return (
    <Checkbox.Root weight={weight} tone="neutral" size="large">
      <Checkbox.Control>
        <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
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
          <Item label="Regular Label Text" weight="regular" />
          <Item label="Bold Label Text" weight="bold" />
        </Checkbox.Group>
      </view>
    </page>
  );
}

root.render(<Root />);
