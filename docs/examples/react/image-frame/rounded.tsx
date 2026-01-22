import { ImageFrame, Flex, VStack, Text } from "@seed-design/react";

export default function ImageFrameRounded() {
  return (
    <Flex gap="x4" wrap="wrap" align="flex-end">
      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={4 / 3}
          rounded={false}
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="rounded=false"
          style={{ width: 150 }}
        />
        <Text color="palette.gray700" textStyle="t1Regular">
          rounded=false
        </Text>
      </VStack>
      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={4 / 3}
          rounded={true}
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="rounded=true"
          style={{ width: 150 }}
        />
        <Text color="palette.gray700" textStyle="t1Regular">
          rounded=true
        </Text>
      </VStack>
    </Flex>
  );
}
