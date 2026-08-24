"use client";

import { Box, Text, VStack } from "@seed-design/react";
import * as React from "react";
import { WheelPicker } from "seed-design/ui/wheel-picker";

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
      "aria-label": "동",
      options: buildingOptions,
      value: building,
      onValueChange: (nextBuilding: string) =>
        setAddress((current) => ({ ...current, building: nextBuilding })),
    },
    {
      id: "unit",
      "aria-label": "호수",
      options: unitOptions,
      value: unit,
      onValueChange: (nextUnit: string) =>
        setAddress((current) => ({ ...current, unit: nextUnit })),
    },
  ];

  return (
    <VStack width="360px" maxWidth="100%" gap="x3" align="center">
      <Box width="full">
        <WheelPicker aria-label="동호수 선택" columns={columns} />
      </Box>
      <Text aria-live="polite">
        {building}동 {unit}호
      </Text>
    </VStack>
  );
}
