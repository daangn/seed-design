import "./styles";
import { useSeedClassName } from "@seed-design/lynx-react";
import { ImageFrame, ImageFrameFloater, ImageFrameIndicator } from "@seed-design/lynx-react";

export default function ImageFrameOverlayInsetExample() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} image-frame-example`}>
      <view style={{ display: "flex", flexDirection: "row", columnGap: 12 }}>
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Landscape with default offset"
          style={{ width: 150 }}
          fallback={
            <view className="image-frame-fallback">
              <text className="image-frame-fallback-label">이미지</text>
            </view>
          }
        >
          <ImageFrameFloater placement="bottom-end">
            <ImageFrameIndicator>default</ImageFrameIndicator>
          </ImageFrameFloater>
        </ImageFrame>

        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Landscape with 0 offset"
          style={{ width: 150 }}
          fallback={
            <view className="image-frame-fallback">
              <text className="image-frame-fallback-label">이미지</text>
            </view>
          }
        >
          <ImageFrameFloater placement="bottom-end" offsetX={0} offsetY={0}>
            <ImageFrameIndicator>offset=0</ImageFrameIndicator>
          </ImageFrameFloater>
        </ImageFrame>

        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Landscape with 12 offset"
          style={{ width: 150 }}
          fallback={
            <view className="image-frame-fallback">
              <text className="image-frame-fallback-label">이미지</text>
            </view>
          }
        >
          <ImageFrameFloater placement="bottom-end" offsetX="12px" offsetY="12px">
            <ImageFrameIndicator>offset=12</ImageFrameIndicator>
          </ImageFrameFloater>
        </ImageFrame>
      </view>
    </view>
  );
}
