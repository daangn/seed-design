import { vars } from "@seed-design/css/vars";
import { Box } from "@seed-design/react";

export default function BoxGradient() {
  return (
    <Box
      bg={`linear-gradient(to right, ${vars.$gradient.highlightMagic})`}
      borderRadius="r2"
      color="palette.staticWhite"
      px="x3"
      py="x2"
    >
      Box Gradient
    </Box>
  );
}
