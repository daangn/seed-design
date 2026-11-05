import { Box, useBreakpoint } from "@seed-design/react";

export default function UseBreakpointExample() {
  const breakpoint = useBreakpoint();

  return (
    <Box
      bg="bg.informativeWeak"
      color="fg.informativeContrast"
      padding="x4"
      borderRadius="r3"
      className="font-mono"
    >
      {breakpoint}
    </Box>
  );
}
