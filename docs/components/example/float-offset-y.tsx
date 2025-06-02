import { Box, ContextualFloatingButton, Float } from "@seed-design/react";

export default function FloatOffsetY() {
  return (
    <Box
      position="relative"
      width="480px"
      height="480px"
      borderWidth={1}
      borderColor="stroke.neutral"
    >
      <Float placement="top-center" offsetY="x4">
        <ContextualFloatingButton>Top Center</ContextualFloatingButton>
      </Float>
      <Float placement="middle-center" offsetY="x4">
        <ContextualFloatingButton>Middle Center</ContextualFloatingButton>
      </Float>
      <Float placement="bottom-center" offsetY="x4">
        <ContextualFloatingButton>Bottom Center</ContextualFloatingButton>
      </Float>
    </Box>
  );
}
