import { Box, Float, ContextualFloatingButton } from "@seed-design/lynx-react";

export default function FloatOffsetY() {
  return (
    <Box
      position="relative"
      width="full"
      maxWidth="480px"
      height="480px"
      borderWidth={1}
      borderColor="stroke.neutralMuted"
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
