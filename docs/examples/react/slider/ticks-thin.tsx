import { Slider } from "seed-design/ui/slider";

export default function SliderTicksThin() {
  return (
    <Slider
      min={0}
      max={100}
      step={0.1}
      defaultValues={[50]}
      ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90]}
      tickWeight="thin"
      getAriaLabel={() => "값"}
    />
  );
}
