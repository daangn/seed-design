import "./styles";
import { useSeedClassName } from "@seed-design/lynx-react";
import { ImageFrame, HStack, VStack, Text } from "@seed-design/lynx-react";

export default function ImageFrameBorderRadius() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} image-frame-example`}>
      <VStack gap="x6" align="flex-start">
        <HStack gap="x4" wrap="wrap" align="flex-end">
          <VStack gap="x2" align="center">
            <ImageFrame
              ratio={4 / 3}
              borderRadius="r1"
              src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=120&dpr=2&q=80"
              alt="size 20 borderRadius=r1"
              style={{ width: 20 }}
              fallback={
                <view className="image-frame-fallback">
                  <text className="image-frame-fallback-label">이미지</text>
                </view>
              }
            />
            <Text color="palette.gray700" textStyle="t1Regular">
              20 / r1 (4px)
            </Text>
          </VStack>
          <VStack gap="x2" align="center">
            <ImageFrame
              ratio={4 / 3}
              borderRadius="r1"
              src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=120&dpr=2&q=80"
              alt="size 24 borderRadius r1"
              style={{ width: 24 }}
              fallback={
                <view className="image-frame-fallback">
                  <text className="image-frame-fallback-label">이미지</text>
                </view>
              }
            />
            <Text color="palette.gray700" textStyle="t1Regular">
              24 / r1 (4px)
            </Text>
          </VStack>
          <VStack gap="x2" align="center">
            <ImageFrame
              ratio={4 / 3}
              borderRadius="r1_5"
              src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=120&dpr=2&q=80"
              alt="size 36 borderRadius r1_5"
              style={{ width: 36 }}
              fallback={
                <view className="image-frame-fallback">
                  <text className="image-frame-fallback-label">이미지</text>
                </view>
              }
            />
            <Text color="palette.gray700" textStyle="t1Regular">
              36 / r1_5 (6px)
            </Text>
          </VStack>
          <VStack gap="x2" align="center">
            <ImageFrame
              ratio={4 / 3}
              borderRadius="r1_5"
              src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=120&dpr=2&q=80"
              alt="size 42 borderRadius r1_5"
              style={{ width: 42 }}
              fallback={
                <view className="image-frame-fallback">
                  <text className="image-frame-fallback-label">이미지</text>
                </view>
              }
            />
            <Text color="palette.gray700" textStyle="t1Regular">
              42 / r1_5 (6px)
            </Text>
          </VStack>
          <VStack gap="x2" align="center">
            <ImageFrame
              ratio={4 / 3}
              borderRadius="r1_5"
              src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=120&dpr=2&q=80"
              alt="size 48 borderRadius r1_5"
              style={{ width: 48 }}
              fallback={
                <view className="image-frame-fallback">
                  <text className="image-frame-fallback-label">이미지</text>
                </view>
              }
            />
            <Text color="palette.gray700" textStyle="t1Regular">
              48 / r1_5 (6px)
            </Text>
          </VStack>
          <VStack gap="x2" align="center">
            <ImageFrame
              ratio={4 / 3}
              borderRadius="r2"
              src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=160&dpr=2&q=80"
              alt="size 64 borderRadius r2"
              style={{ width: 64 }}
              fallback={
                <view className="image-frame-fallback">
                  <text className="image-frame-fallback-label">이미지</text>
                </view>
              }
            />
            <Text color="palette.gray700" textStyle="t1Regular">
              64+ / r2 (8px)
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </view>
  );
}
