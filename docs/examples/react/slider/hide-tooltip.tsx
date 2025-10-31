import { Slider } from "seed-design/ui/slider";

export default function SliderHideTooltip() {
  return <Slider min={0} max={100} defaultValues={[50]} hideTooltip getAriaLabel={() => "값"} />;
}
