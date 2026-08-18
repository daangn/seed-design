import { root } from "@lynx-js/react";
import { ProgressCircle, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <view className="progress-circle-preview">
        <ProgressCircle.Root tone="brand">
          <ProgressCircle.Range />
        </ProgressCircle.Root>
      </view>
    </page>
  );
}

root.render(<Root />);
