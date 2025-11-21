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
      <ScrollFog placement={["top", "bottom"]}>
        <VStack gap="x4" px="x4" py="20px" width="full">
          {Array.from({ length: 20 }, (_, i) => (
            <Box key={i} bg="gray" px="x4" py="x3" borderRadius="r2">
              {i + 1}
            </Box>
          ))}
        </VStack>
      </ScrollFog>
    </div>
  );
}
