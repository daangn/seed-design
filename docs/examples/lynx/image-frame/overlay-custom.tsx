import "./styles";
import { useSeedClassName } from "@seed-design/lynx-react";
import { ImageFrame, ImageFrameFloater } from "@seed-design/lynx-react";

export default function ImageFrameOverlayCustomExample() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} image-frame-example`}>
      <ImageFrame
        ratio={1}
        borderRadius="r2"
        stroke
        src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
        alt="Landscape with custom overlay"
        style={{ width: 200 }}
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
              borderRadius: 4,
              color: "white",
              fontSize: 12,
            }}
          >
            <text className="image-frame-custom-label">Custom Element</text>
          </view>
        </ImageFrameFloater>
      </ImageFrame>
    </view>
  );
}
