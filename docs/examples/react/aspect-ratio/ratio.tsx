import { AspectRatio, Box, HStack } from "@seed-design/react";

export default function AspectRatioRatio() {
  return (
    <HStack gap="x4">
      <Box width="150px">
        <AspectRatio ratio={1}>
          <img src="https://picsum.photos/seed/square/400/400" alt="1:1 Square" />
        </AspectRatio>
      </Box>
      <Box width="150px">
        <AspectRatio ratio={4 / 3}>
          <img src="https://picsum.photos/seed/4-3/400/300" alt="4:3" />
        </AspectRatio>
      </Box>
      <Box width="150px">
        <AspectRatio ratio={16 / 9}>
          <img src="https://picsum.photos/seed/16-9/400/225" alt="16:9" />
        </AspectRatio>
      </Box>
    </HStack>
  );
}
