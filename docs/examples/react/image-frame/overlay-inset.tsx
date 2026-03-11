import { AspectRatio } from "@seed-design/react";
import { ImageFrame, ImageFrameFloater, ImageFrameIndicator } from "seed-design/ui/image-frame";

export default function ImageFrameOverlayInsetExample() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <AspectRatio ratio={1} style={{ width: 150 }}>
        <ImageFrame
          borderRadius="r2"
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Landscape with default offset"
        >
          <ImageFrameFloater placement="bottom-end">
            <ImageFrameIndicator>default</ImageFrameIndicator>
          </ImageFrameFloater>
        </ImageFrame>
      </AspectRatio>

      <AspectRatio ratio={1} style={{ width: 150 }}>
        <ImageFrame
          borderRadius="r2"
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Landscape with 0 offset"
        >
          <ImageFrameFloater placement="bottom-end" offsetX={0} offsetY={0}>
            <ImageFrameIndicator>offset=0</ImageFrameIndicator>
          </ImageFrameFloater>
        </ImageFrame>
      </AspectRatio>

      <AspectRatio ratio={1} style={{ width: 150 }}>
        <ImageFrame
          borderRadius="r2"
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Landscape with 12 offset"
        >
          <ImageFrameFloater placement="bottom-end" offsetX="12px" offsetY="12px">
            <ImageFrameIndicator>offset=12</ImageFrameIndicator>
          </ImageFrameFloater>
        </ImageFrame>
      </AspectRatio>
    </div>
  );
}
