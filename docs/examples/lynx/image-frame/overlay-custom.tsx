import "./styles";
import { ImageFrame, ImageFrameFloater } from "@seed-design/lynx-react";

export default function ImageFrameOverlayCustomExample() {
  return (
    <ImageFrame
      ratio={1}
      borderRadius="r2"
      stroke
      src="https://avatars.githubusercontent.com/u/54893898?v=4"
      alt="Profile with custom overlay"
      style={{ width: "200px" }}
      fallback={
        <view className="image-frame-fallback">
          <text className="image-frame-fallback-label">이미지</text>
        </view>
      }
    >
      <ImageFrameFloater placement="bottom-end">
        <view
          style={{
            padding: "4px 8px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderRadius: "4px",
            color: "white",
            fontSize: "12px",
          }}
        >
          <text className="image-frame-custom-label">Custom Element</text>
        </view>
      </ImageFrameFloater>
    </ImageFrame>
  );
}
