import { Box, Inline } from "@seed-design/react";

/**
 * @deprecated Use `HStack` instead.
 */
export default function InlinePreview() {
  return (
    <Inline bg="bg.layerDefault" gap="x2" width="full" borderRadius="r2">
      <Box bg="bg.brandSolid" px="x4" py="x3" borderRadius="r2">
        1
      </Box>
      <Box bg="bg.brandSolid" px="x4" py="x3" borderRadius="r2">
        2
      </Box>
      <Box bg="bg.brandSolid" px="x4" py="x3" borderRadius="r2">
        3
      </Box>
    </Inline>
  );
}
