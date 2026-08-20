"use client";

import { Box, Text, VStack, WheelPicker } from "@seed-design/react";
import * as React from "react";

const options = ["작게", "보통", "크게"].map((label) => ({ value: label, label }));

export default function WheelPickerPackageApi() {
  const [value, setValue] = React.useState("보통");

  return (
    <VStack width="320px" maxWidth="100%" gap="x3" align="center">
      <Box width="full">
        <WheelPicker.Root aria-label="글자 크기 선택">
          <WheelPicker.Column
            aria-label="글자 크기"
            options={options}
            value={value}
            onValueChange={setValue}
          />
        </WheelPicker.Root>
      </Box>
      <Text aria-live="polite">선택값: {value}</Text>
    </VStack>
  );
}
