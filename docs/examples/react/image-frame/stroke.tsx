import { ImageFrame, Flex, VStack, Text } from "@ride-developer/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

export default function ImageFrameStroke() {
  return (
    <Flex gap="x4" wrap="wrap" align="flex-end">
      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={4 / 3}
          stroke={false}
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="stroke=false"
          style={{ width: 150 }}
          fallback={<ContentPlaceholder type="post" />}
        />
        <Text color="palette.gray700" textStyle="t1Regular">
          stroke=false
        </Text>
      </VStack>
      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={4 / 3}
          stroke={true}
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="stroke=true"
          style={{ width: 150 }}
          fallback={<ContentPlaceholder type="group" />}
        />
        <Text color="palette.gray700" textStyle="t1Regular">
          stroke=true
        </Text>
      </VStack>
    </Flex>
  );
}
