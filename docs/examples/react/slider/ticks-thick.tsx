import { Slider } from "seed-design/ui/slider";

export default function SliderTicksThick() {
  return (
    <Slider min={0} max={100} step={25} defaultValues={[50]} ticks={[25, 50, 75]} variant="thick" />
  );
}
