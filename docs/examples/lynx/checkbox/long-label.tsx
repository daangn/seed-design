import { root } from "@lynx-js/react";
import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import { Checkbox, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

const label =
  "Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla.";

function Item({ size }: { size: Checkbox.RootProps["size"] }) {
  return (
    <Checkbox.Root size={size} tone="neutral">
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
          <Item size="medium" />
          <Item size="large" />
        </Checkbox.Group>
      </view>
    </page>
  );
}

root.render(<Root />);
