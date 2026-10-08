import "./styles";
import { ImageFrame, HStack } from "@seed-design/lynx-react";

export default function ImageFrameFallbackExample() {
  return (
    <HStack gap="x3" wrap="wrap" align="flex-end">
      <ImageFrame
        ratio={1}
        borderRadius="r2"
        stroke
        src="https://invalid-url"
        alt="이미지를 불러올 수 없습니다"
        style={{ width: "120px" }}
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
        alt="이미지를 불러올 수 없습니다"
        style={{ width: "120px" }}
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
        alt="이미지를 불러올 수 없습니다"
        style={{ width: "120px" }}
        fallback={
          <view className="image-frame-fallback">
            <text className="image-frame-fallback-label">이미지</text>
          </view>
        }
      />
    </HStack>
  );
}
