import { AspectRatio, Flex, Text, VStack } from "@seed-design/react";
import { ImageFrame } from "seed-design/ui/image-frame";

export default function ImageFrameWithAspectRatio() {
  return (
    <Flex gap="x2" wrap="wrap" align="flex-end">
      <VStack gap="x2" alignItems="center">
        <AspectRatio ratio={1} style={{ width: 120 }}>
          <ImageFrame
            borderRadius="r2"
            stroke
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
            alt="1:1"
          />
        </AspectRatio>
        <Text color="palette.gray700" textStyle="t1Regular">
          1:1
        </Text>
      </VStack>
      <VStack gap="x2" alignItems="center">
        <AspectRatio ratio={4 / 3} style={{ width: 160 }}>
          <ImageFrame
            borderRadius="r2"
            stroke
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
            alt="4:3"
          />
        </AspectRatio>
        <Text color="palette.gray700" textStyle="t1Regular">
          4:3
        </Text>
      </VStack>
      <VStack gap="x2" alignItems="center">
        <AspectRatio ratio={16 / 9} style={{ width: 200 }}>
          <ImageFrame
            borderRadius="r2"
            stroke
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
            alt="16:9"
          />
        </AspectRatio>
        <Text color="palette.gray700" textStyle="t1Regular">
          16:9
        </Text>
      </VStack>
    </Flex>
  );
}
