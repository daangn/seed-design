import { Box, HStack } from "@seed-design/react";

export default function HStackPreview() {
  return (
    <HStack bg="bg.layerDefault" gap="x2" width="full" borderRadius="r2">
      <Box bg="bg.brandSolid" px="x4" py="x3" borderRadius="r2">
        1
      </Box>
      <Box bg="bg.brandSolid" px="x4" py="x3" borderRadius="r2">
        2
      </Box>
      <Box bg="bg.brandSolid" px="x4" py="x3" borderRadius="r2">
        3
      </Box>
    </HStack>
  );
}
