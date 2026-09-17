import "./styles";
import { useSeedClassName } from "@seed-design/lynx-react";
import { ImageFrame, HStack, VStack, Text } from "@seed-design/lynx-react";

export default function ImageFrameStroke() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} image-frame-example`}>
      <HStack gap="x4" wrap="wrap" align="flex-end">
        <VStack gap="x2" align="center">
          <ImageFrame
            ratio={4 / 3}
            stroke={false}
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
            alt="stroke=false"
            style={{ width: 150 }}
            fallback={
              <view className="image-frame-fallback">
                <text className="image-frame-fallback-label">이미지</text>
              </view>
            }
          />
          <Text color="palette.gray700" textStyle="t1Regular">
            stroke=false
          </Text>
        </VStack>
        <VStack gap="x2" align="center">
          <ImageFrame
            ratio={4 / 3}
            stroke={true}
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
            alt="stroke=true"
            style={{ width: 150 }}
            fallback={
              <view className="image-frame-fallback">
                <text className="image-frame-fallback-label">이미지</text>
              </view>
            }
          />
          <Text color="palette.gray700" textStyle="t1Regular">
            stroke=true
          </Text>
        </VStack>
      </HStack>
    </view>
  );
}
