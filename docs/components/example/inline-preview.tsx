import { Box, Inline } from "@seed-design/react";

export default function InlinePreview() {
  return (
    <Inline background="bg.layerDefault" gap="x2" width="full" borderRadius="r2">
      <Box background="bg.brandSolid" paddingX="x4" paddingY="x3" borderRadius="r2">
        1
      </Box>
      <Box background="bg.brandSolid" paddingX="x4" paddingY="x3" borderRadius="r2">
        2
      </Box>
      <Box background="bg.brandSolid" paddingX="x4" paddingY="x3" borderRadius="r2">
        3
      </Box>
    </Inline>
  );
}
