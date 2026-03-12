import { ImageFrame, Flex, VStack, Text } from "@seed-design/react";

export default function ImageFrameRatio() {
  return (
    <Flex gap="x2" wrap="wrap" align="flex-end">
      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="1:1"
          style={{ width: 120 }}
        />
        <Text color="palette.gray700" textStyle="t1Regular">
          1:1
        </Text>
      </VStack>
      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={4 / 3}
          borderRadius="r2"
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="4:3"
          style={{ width: 160 }}
        />
        <Text color="palette.gray700" textStyle="t1Regular">
          4:3
        </Text>
      </VStack>
      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={16 / 9}
          borderRadius="r2"
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="16:9"
          style={{ width: 200 }}
        />
        <Text color="palette.gray700" textStyle="t1Regular">
          16:9
        </Text>
      </VStack>
    </Flex>
  );
}
