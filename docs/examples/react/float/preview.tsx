import { Box, Float } from "@seed-design/react";
import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";

export default function FloatPreview() {
  return (
    <Box
      position="relative"
      width="480px"
      height="480px"
      borderWidth={1}
      borderColor="stroke.neutralMuted"
    >
      <Float placement="top-start">
        <ContextualFloatingButton>Top Start</ContextualFloatingButton>
      </Float>
      <Float placement="top-center">
        <ContextualFloatingButton>Top Center</ContextualFloatingButton>
      </Float>
      <Float placement="top-end">
        <ContextualFloatingButton>Top End</ContextualFloatingButton>
      </Float>
      <Float placement="middle-start">
        <ContextualFloatingButton>Middle Start</ContextualFloatingButton>
      </Float>
      <Float placement="middle-center">
        <ContextualFloatingButton>Middle Center</ContextualFloatingButton>
      </Float>
      <Float placement="middle-end">
        <ContextualFloatingButton>Middle End</ContextualFloatingButton>
      </Float>
      <Float placement="bottom-start">
        <ContextualFloatingButton>Bottom Start</ContextualFloatingButton>
      </Float>
      <Float placement="bottom-center">
        <ContextualFloatingButton>Bottom Center</ContextualFloatingButton>
      </Float>
      <Float placement="bottom-end">
        <ContextualFloatingButton>Bottom End</ContextualFloatingButton>
      </Float>
    </Box>
  );
}
