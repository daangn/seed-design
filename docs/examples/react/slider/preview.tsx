import { Slider } from "seed-design/ui/slider";

export default function SliderPreview() {
  return <Slider min={0} max={100} defaultValues={[50]} getAriaLabel={() => "값"} />;
}
