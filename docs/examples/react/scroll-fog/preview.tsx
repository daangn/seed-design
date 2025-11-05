import { Box, ScrollFog, VStack } from "@seed-design/react";

export default function ScrollFogPreview() {
  return (
    <div
      style={{
        maxHeight: "200px",
        width: "300px",
        border: "1px solid var(--seed-color-stroke-neutral-weak)",
        borderRadius: "8px",
      }}
    >
      <ScrollFog>
        <VStack gap="x4" p="x4" width="full">
          {Array.from({ length: 20 }, (_, i) => (
            <Box key={i} bg="bg.layerDefault" px="x4" py="x3" borderRadius="r2">
              항목 {i + 1}
            </Box>
          ))}
        </VStack>
      </ScrollFog>
    </div>
  );
}
