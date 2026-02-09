import { AspectRatio, Text, VStack } from "@seed-design/react";

export default function AspectRatioPreview() {
  return (
    <VStack gap="x4">
      <AspectRatio ratio={4 / 3} width="160px" bg="palette.gray100">
        <Text color="palette.gray700">4 / 3</Text>
      </AspectRatio>
      <AspectRatio ratio={1} width="160px" bg="palette.gray100">
        <Text color="palette.gray700">1:1</Text>
      </AspectRatio>
      <AspectRatio ratio={16 / 9} width="160px" bg="palette.gray100">
        <Text color="palette.gray700">16 / 9</Text>
      </AspectRatio>
    </VStack>
  );
}
