import { root } from "@lynx-js/react";
import { Switch, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <view className="switch-preview">
        <Switch.Root defaultChecked>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Root>
      </view>
    </page>
  );
}

root.render(<Root />);
