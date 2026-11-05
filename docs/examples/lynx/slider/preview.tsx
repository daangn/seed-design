import "./styles";

import { Slider } from "@/components/ui/slider";

export default function Example() {
  return (
    <view className="slider-preview">
      <Slider min={0} max={100} defaultValues={[50]} getAccessibilityLabel={() => "값"} />
    </view>
  );
}
