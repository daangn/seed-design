import "./styles";

import { ProgressCircle } from "@/components/ui/progress-circle";

import { useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view
      className={`${seedClassName} progress-circle-preview--dark docs-lynx-progress-circle-root`}
    >
      <view className="progress-circle-preview">
        <ProgressCircle tone="staticWhite" />
      </view>
    </view>
  );
}
