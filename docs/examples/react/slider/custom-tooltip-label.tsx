import { Slider } from "seed-design/ui/slider";

const formatter = new Intl.NumberFormat("ko-KR", { style: "decimal" });

export default function SliderCustomTooltipLabel() {
  return (
    <Slider
      min={0}
      max={1_000_000}
      defaultValues={[20_000, 500_000]}
      getTooltipChildren={({ value, thumbIndex }) => (
        <>
          thumb {thumbIndex}
          <br />
          {formatter.format(value)}
        </>
      )}
      getAriaValuetext={formatter.format}
      getAriaLabel={() => "값"}
    />
  );
}
