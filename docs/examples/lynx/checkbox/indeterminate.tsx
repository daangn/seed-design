import { root } from "@lynx-js/react";
import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import IconMinusFatFill from "@karrotmarket/lynx-monochrome-icon/IconMinusFatFill";
import { Checkbox, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <view className="checkbox-preview">
        <Checkbox.Root defaultChecked indeterminate tone="neutral" size="large">
          <Checkbox.Control>
            <Checkbox.Indicator
              checked={<IconCheckmarkFatFill />}
              indeterminate={<IconMinusFatFill />}
            />
          </Checkbox.Control>
          <Checkbox.Label>indeterminate</Checkbox.Label>
        </Checkbox.Root>
      </view>
    </page>
  );
}

root.render(<Root />);
