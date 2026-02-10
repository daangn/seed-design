import { Flex, VStack, Text, ImageFrame } from "@seed-design/react";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

export default function ImageFrameFallbackExample() {
  return (
    <Flex gap="x4" wrap="wrap" align="flex-end">
      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src="https://example.com/invalid-image.jpg"
          alt="이미지 로딩 실패 예시"
          fallback={<IdentityPlaceholder />}
          style={{ width: 120 }}
        />
        <Text color="palette.gray700" textStyle="t1Regular">
          Identity Placeholder fallback
        </Text>
      </VStack>
    </Flex>
  );
}
