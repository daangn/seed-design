import { ImageFrame, ImageFrameFloater } from "@ride-developer/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

export default function ImageFrameOverlayCustomExample() {
  return (
    <ImageFrame
      ratio={1}
      borderRadius="r2"
      stroke
      src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
      alt="Landscape with custom overlay"
      style={{ width: 200 }}
      fallback={<ContentPlaceholder type="business" />}
    >
      <ImageFrameFloater placement="bottom-end">
        <div
          style={{
            padding: "4px 8px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderRadius: 4,
            color: "white",
            fontSize: 12,
          }}
        >
          Custom Element
        </div>
      </ImageFrameFloater>
    </ImageFrame>
  );
}
