import "./styles";

import { Slider } from "@/components/ui/slider";

export default function Example() {
  return (
    <view className="slider-basic">
      <Slider min={0} max={10} defaultValues={[5]} getAccessibilityLabel={() => "값"} />
      <Slider min={0} max={1000} defaultValues={[600]} getAccessibilityLabel={() => "값"} />
    </view>
  );
}
