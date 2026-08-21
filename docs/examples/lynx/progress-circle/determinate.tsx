import "./styles";

import { root } from "@lynx-js/react";
import { ProgressCircle, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="progress-circle-preview">
        <ProgressCircle.Root minValue={0} maxValue={100} value={40}>
          <ProgressCircle.Range />
        </ProgressCircle.Root>
      </view>
    </page>
  );
}

root.render(<Root />);
