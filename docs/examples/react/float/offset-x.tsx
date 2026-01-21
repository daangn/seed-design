import { Box, Float } from "@seed-design/react";
import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";

export default function FloatOffsetX() {
  return (
    <Box
      position="relative"
      width="480px"
      height="480px"
      borderWidth={1}
      borderColor="stroke.neutralMuted"
    >
      <Float placement="middle-start" offsetX="x4">
        <ContextualFloatingButton>Middle Start</ContextualFloatingButton>
      </Float>
      <Float placement="middle-center" offsetX="x4">
        <ContextualFloatingButton>Middle Center</ContextualFloatingButton>
      </Float>
      <Float placement="middle-end" offsetX="x4">
        <ContextualFloatingButton>Middle End</ContextualFloatingButton>
      </Float>
    </Box>
  );
}
