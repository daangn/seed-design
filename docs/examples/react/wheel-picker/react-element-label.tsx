"use client";

import { Box, HStack, Text, VStack } from "@seed-design/react";
import * as React from "react";
import { WheelPicker } from "seed-design/ui/wheel-picker";

function ColorDot({ color }: { color: string }) {
  return (
    <Box
      as="span"
      aria-hidden="true"
      width="x3"
      height="x3"
      borderRadius="full"
      style={{ backgroundColor: color }}
    />
  );
}

const colorOptions = [
  { value: "carrot", name: "당근색", color: "#ff6f0f" },
  { value: "blue", name: "파란색", color: "#4285f4" },
  { value: "green", name: "초록색", color: "#22a06b" },
].map(({ value, name, color }) => ({
  value,
  ariaLabel: name,
  label: (
    <HStack as="span" gap="x2" align="center">
      <ColorDot color={color} />
      <span>{name}</span>
    </HStack>
  ),
}));

export default function WheelPickerReactElementLabel() {
  const [value, setValue] = React.useState("carrot");

  return (
    <VStack width="320px" maxWidth="100%" gap="x3" align="center">
      <Box width="full">
        <WheelPicker
          aria-label="색상 선택"
          columns={[
            {
              id: "color",
              "aria-label": "색상",
              options: colorOptions,
              value,
              onValueChange: setValue,
            },
          ]}
        />
      </Box>
      <Text aria-live="polite">선택값: {value}</Text>
    </VStack>
  );
}
