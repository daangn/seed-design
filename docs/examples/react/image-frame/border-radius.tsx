import { AspectRatio, Flex, Text, VStack } from "@seed-design/react";
import { ImageFrame } from "seed-design/ui/image-frame";

export default function ImageFrameBorderRadius() {
  return (
    <VStack gap="x6" alignItems="flex-start">
      <Flex gap="x4" wrap="wrap" align="flex-end">
        <VStack gap="x2" alignItems="center">
          <AspectRatio ratio={4 / 3} style={{ width: 20 }}>
            <ImageFrame
              borderRadius="r1"
              src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=120&dpr=2&q=80"
              alt="size 20 borderRadius=r1"
            />
          </AspectRatio>
          <Text color="palette.gray700" textStyle="t1Regular">
            20 / r1 (4px)
          </Text>
        </VStack>
        <VStack gap="x2" alignItems="center">
          <AspectRatio ratio={4 / 3} style={{ width: 24 }}>
            <ImageFrame
              borderRadius="r1"
              src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=120&dpr=2&q=80"
              alt="size 24 borderRadius r1"
            />
          </AspectRatio>
          <Text color="palette.gray700" textStyle="t1Regular">
            24 / r1 (4px)
          </Text>
        </VStack>
        <VStack gap="x2" alignItems="center">
          <AspectRatio ratio={4 / 3} style={{ width: 36 }}>
            <ImageFrame
              borderRadius="r1_5"
              src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=120&dpr=2&q=80"
              alt="size 36 borderRadius r1_5"
            />
          </AspectRatio>
          <Text color="palette.gray700" textStyle="t1Regular">
            36 / r1_5 (6px)
          </Text>
        </VStack>
        <VStack gap="x2" alignItems="center">
          <AspectRatio ratio={4 / 3} style={{ width: 42 }}>
            <ImageFrame
              borderRadius="r1_5"
              src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=120&dpr=2&q=80"
              alt="size 42 borderRadius r1_5"
            />
          </AspectRatio>
          <Text color="palette.gray700" textStyle="t1Regular">
            42 / r1_5 (6px)
          </Text>
        </VStack>
        <VStack gap="x2" alignItems="center">
          <AspectRatio ratio={4 / 3} style={{ width: 48 }}>
            <ImageFrame
              borderRadius="r1_5"
              src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=120&dpr=2&q=80"
              alt="size 48 borderRadius r1_5"
            />
          </AspectRatio>
          <Text color="palette.gray700" textStyle="t1Regular">
            48 / r1_5 (6px)
          </Text>
        </VStack>
        <VStack gap="x2" alignItems="center">
          <AspectRatio ratio={4 / 3} style={{ width: 64 }}>
            <ImageFrame
              borderRadius="r2"
              src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=160&dpr=2&q=80"
              alt="size 64 borderRadius r2"
            />
          </AspectRatio>
          <Text color="palette.gray700" textStyle="t1Regular">
            64+ / r2 (8px)
          </Text>
        </VStack>
      </Flex>
    </VStack>
  );
}
