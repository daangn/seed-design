import { Slider } from "seed-design/ui/slider";

export default function SliderTicksThin() {
  return <Slider min={0} max={100} defaultValues={[30]} ticks={[20, 40, 60, 80]} />;
}
