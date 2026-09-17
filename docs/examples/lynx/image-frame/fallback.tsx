import "./styles";
import { useSeedClassName } from "@seed-design/lynx-react";
import { ImageFrame, HStack } from "@seed-design/lynx-react";

export default function ImageFrameFallbackExample() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} image-frame-example`}>
      <HStack gap="x3" wrap="wrap" align="flex-end">
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src="https://invalid-url"
          alt="Fallback with buySell type"
          style={{ width: 120 }}
          fallback={
            <view className="image-frame-fallback">
              <text className="image-frame-fallback-label">이미지</text>
            </view>
          }
        />
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src="https://invalid-url"
          alt="Fallback with food type"
          style={{ width: 120 }}
          fallback={
            <view className="image-frame-fallback">
              <text className="image-frame-fallback-label">이미지</text>
            </view>
          }
        />
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src="https://invalid-url"
          alt="Fallback with jobs type"
          style={{ width: 120 }}
          fallback={
            <view className="image-frame-fallback">
              <text className="image-frame-fallback-label">이미지</text>
            </view>
          }
        />
      </HStack>
    </view>
  );
}
