import { VStack, Text } from "@seed-design/react";
import { useState } from "react";
import { Slider } from "seed-design/ui/slider";

const days = ["일", "월", "화", "수", "목", "금", "토"];

function getHumanReadableDayOfWeek(value: number) {
  if (days[value] === undefined) throw new Error("Invalid day value");

  return `${days[value]}요일`;
}

export default function SliderGetAriaValuetext() {
  const [values, setValues] = useState([1, 3]);

  return (
    <VStack gap="spacingY.componentDefault" width="full" align="center">
      <Slider
        min={0}
        max={days.length - 1}
        minStepsBetweenThumbs={1}
        markers={days.map((label, value) => ({ label, value }))}
        ticks={days.slice(1, -1).map((_, index) => index + 1)}
        tickWeight="thick"
        values={values}
        onValuesChange={setValues}
        getAriaLabel={(thumbIndex) => (thumbIndex === 0 ? "시작" : "종료")}
        getAriaValuetext={getHumanReadableDayOfWeek}
        getValueIndicatorLabel={({ value }) => getHumanReadableDayOfWeek(value)}
      />
      <Text>values: {JSON.stringify(values)}</Text>
      <Text>aria-valuetext: {JSON.stringify(values.map(getHumanReadableDayOfWeek))}</Text>
    </VStack>
  );
}
