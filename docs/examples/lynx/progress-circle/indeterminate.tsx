import "./styles";

import { ProgressCircle } from "@/components/ui/progress-circle";
import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="progress-circle-preview">
        <ProgressCircle />
      </view>
    </page>
  );
}

root.render(<Root />);
