import { Box, Text, VStack, WheelPicker } from "@seed-design/react";

const options = ["낮음", "보통", "높음"].map((label) => ({ value: label, label }));

export default function WheelPickerStates() {
  return (
    <VStack width="160px" gap="x2" align="center">
      <Text>Disabled</Text>
      <Box width="full">
        <WheelPicker.Root aria-label="비활성 중요도" disabled>
          <WheelPicker.Column aria-label="중요도" options={options} defaultValue="보통" />
        </WheelPicker.Root>
      </Box>
    </VStack>
  );
}
