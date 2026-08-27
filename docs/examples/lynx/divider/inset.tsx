import "./styles";

import { root } from "@lynx-js/react";
import { Divider, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="divider-example divider-example--column">
        <view className="divider-example__vertical-stack">
          <view className="divider-example__block" />
          <Divider inset />
          <view className="divider-example__block" />
        </view>
        <view className="divider-example__horizontal-stack">
          <view className="divider-example__block" />
          <Divider orientation="vertical" inset />
          <view className="divider-example__block" />
        </view>
      </view>
    </page>
  );
}

root.render(<Root />);
