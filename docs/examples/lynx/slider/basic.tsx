import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { Slider } from "@/components/ui/slider";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-slider-root`}>
      <view className="slider-basic">
        <Slider min={0} max={10} defaultValues={[5]} getAccessibilityLabel={() => "값"} />
        <Slider min={0} max={1000} defaultValues={[600]} getAccessibilityLabel={() => "값"} />
      </view>
    </view>
  );
}
