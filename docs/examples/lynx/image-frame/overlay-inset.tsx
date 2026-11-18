import "./styles";
import { ImageFrame, ImageFrameFloater, ImageFrameIndicator } from "@seed-design/lynx-react";

export default function ImageFrameOverlayInsetExample() {
  return (
    <view style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "12px" }}>
      <ImageFrame
        ratio={1}
        borderRadius="r2"
        stroke
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        alt="Profile with default offset"
        style={{ width: "150px" }}
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
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        alt="Profile with 0 offset"
        style={{ width: "150px" }}
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
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        alt="Profile with 12 offset"
        style={{ width: "150px" }}
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
  );
}
