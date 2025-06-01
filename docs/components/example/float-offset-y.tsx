import { Box, ContextualFloatingButton, Float } from "@seed-design/react";

export default function FloatOffsetY() {
  return (
    <Box
      position="relative"
      width="300px"
      height="300px"
      borderWidth={1}
      borderColor="stroke.neutral"
    >
      <Float placement="top-center" offsetY="16px">
        <ContextualFloatingButton>Top Center</ContextualFloatingButton>
      </Float>
      <Float placement="middle-center" offsetY="16px">
        <ContextualFloatingButton>Middle Center</ContextualFloatingButton>
      </Float>
      <Float placement="bottom-center" offsetY="16px">
        <ContextualFloatingButton>Bottom Center</ContextualFloatingButton>
      </Float>
    </Box>
  );
}
