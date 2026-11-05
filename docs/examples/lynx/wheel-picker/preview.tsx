import "./styles";

import * as React from "@lynx-js/react";

import { WheelPicker } from "@/components/ui/wheel-picker";

const buildingOptions = Array.from({ length: 10 }, (_, index) => {
  const value = String(101 + index);
  return { value, label: `${value}동` };
});

const unitOptions = Array.from({ length: 15 }, (_, floorIndex) =>
  Array.from({ length: 4 }, (_, lineIndex) => {
    const value = String((floorIndex + 1) * 100 + lineIndex + 1);
    return { value, label: `${value}호` };
  }),
).flat();

export default function WheelPickerPreview() {
  const [{ building, unit }, setAddress] = React.useState({
    building: "103",
    unit: "1202",
  });

  const columns = [
    {
      id: "building",
      "accessibility-label": "동",
      options: buildingOptions,
      value: building,
      onValueChange: (nextBuilding: string) => {
        "background only";
        setAddress((current) => ({ ...current, building: nextBuilding }));
      },
    },
    {
      id: "unit",
      "accessibility-label": "호수",
      options: unitOptions,
      value: unit,
      onValueChange: (nextUnit: string) => {
        "background only";
        setAddress((current) => ({ ...current, unit: nextUnit }));
      },
    },
  ];

  return (
    <view className="wheel-picker-preview">
      <view className="wheel-picker-preview__picker">
        <WheelPicker columns={columns} />
      </view>
      <text id="wheel-picker-preview-status" className="wheel-picker-preview__status">
        {building}동 {unit}호
      </text>
    </view>
  );
}
