import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { Slider } from "@/components/ui/slider";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-slider-root`}>
      <view className="slider-preview">
        <Slider min={0} max={100} defaultValues={[50]} getAccessibilityLabel={() => "값"} />
      </view>
    </view>
  );
}
