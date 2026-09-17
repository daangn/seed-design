import "./styles";
import { useSeedClassName } from "@seed-design/lynx-react";
import { ImageFrame, HStack, VStack, Text } from "@seed-design/lynx-react";

export default function ImageFrameRatio() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} image-frame-example`}>
      <HStack gap="x2" wrap="wrap" align="flex-end">
        <VStack gap="x2" align="center">
          <ImageFrame
            ratio={1}
            borderRadius="r2"
            stroke
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
            alt="1:1"
            style={{ width: 120 }}
            fallback={
              <view className="image-frame-fallback">
                <text className="image-frame-fallback-label">이미지</text>
              </view>
            }
          />
          <Text color="palette.gray700" textStyle="t1Regular">
            1:1
          </Text>
        </VStack>
        <VStack gap="x2" align="center">
          <ImageFrame
            ratio={4 / 3}
            borderRadius="r2"
            stroke
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
            alt="4:3"
            style={{ width: 160 }}
            fallback={
              <view className="image-frame-fallback">
                <text className="image-frame-fallback-label">이미지</text>
              </view>
            }
          />
          <Text color="palette.gray700" textStyle="t1Regular">
            4:3
          </Text>
        </VStack>
        <VStack gap="x2" align="center">
          <ImageFrame
            ratio={16 / 9}
            borderRadius="r2"
            stroke
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
            alt="16:9"
            style={{ width: 200 }}
            fallback={
              <view className="image-frame-fallback">
                <text className="image-frame-fallback-label">이미지</text>
              </view>
            }
          />
          <Text color="palette.gray700" textStyle="t1Regular">
            16:9
          </Text>
        </VStack>
      </HStack>
    </view>
  );
}
