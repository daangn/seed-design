import { Box, ContextualFloatingButton, Float } from "@seed-design/react";

export default function FloatOffsetX() {
  return (
    <Box
      position="relative"
      width="300px"
      height="300px"
      borderWidth={1}
      borderColor="stroke.neutral"
    >
      <Float placement="middle-start" offsetX="16px">
        <ContextualFloatingButton>Middle Start</ContextualFloatingButton>
      </Float>
      <Float placement="middle-center" offsetX="16px">
        <ContextualFloatingButton>Middle Center</ContextualFloatingButton>
      </Float>
      <Float placement="middle-end">
        <ContextualFloatingButton>Middle End</ContextualFloatingButton>
      </Float>
    </Box>
  );
}
