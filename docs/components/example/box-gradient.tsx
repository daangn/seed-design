import { Box, VStack } from "@seed-design/react";

export default function BoxGradient() {
  return (
    <VStack gap="x2">
      <Box
        backgroundGradient="highlightMagic"
        backgroundGradientDirection="43deg"
        borderRadius="r2"
        color="palette.staticWhite"
        px="x3"
        py="x2"
      >
        Box Gradient
      </Box>
      <Box
        backgroundGradient="highlightMagic"
        backgroundGradientDirection="to bottom"
        borderRadius="r2"
        color="palette.staticWhite"
        px="x3"
        py="x2"
      >
        Box Gradient
      </Box>
    </VStack>
  );
}
