import "./styles";

import { Divider } from "@seed-design/lynx-react";

export default function Example() {
  return (
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
  );
}
