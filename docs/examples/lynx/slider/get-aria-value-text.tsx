import "./styles";

import { useState } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { Slider } from "@/components/ui/slider";

const days = ["일", "월", "화", "수", "목", "금", "토"];

function getHumanReadableDayOfWeek(value: number) {
  if (days[value] === undefined) throw new Error("Invalid day value");

  return `${days[value]}요일`;
}

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [values, setValues] = useState([1, 3]);

  return (
    <view className={`${seedClassName} docs-lynx-slider-root`}>
      <view className="slider-preview">
        <Slider
          min={0}
          max={days.length - 1}
          minStepsBetweenThumbs={1}
          markers={days.map((label, value) => ({ label, value }))}
          ticks={days.slice(1, -1).map((_, index) => index + 1)}
          tickWeight="thick"
          values={values}
          onValuesChange={setValues}
          getAccessibilityLabel={(thumbIndex) => (thumbIndex === 0 ? "시작" : "종료")}
          getAccessibilityValueText={getHumanReadableDayOfWeek}
          getValueIndicatorLabel={({ value }) => getHumanReadableDayOfWeek(value)}
        />
        <text className="slider-preview__status">values: {JSON.stringify(values)}</text>
        <text className="slider-preview__status">
          accessibility-value-text: {JSON.stringify(values.map(getHumanReadableDayOfWeek))}
        </text>
      </view>
    </view>
  );
}
