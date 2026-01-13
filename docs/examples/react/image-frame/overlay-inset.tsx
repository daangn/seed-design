import { ImageFrame, ImageFrameOverlayPositioner, ImageFrameOverlay } from "@seed-design/react";

export default function ImageFrameOverlayInsetExample() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <ImageFrame
        ratio={1}
        rounded
        stroke
        src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
        alt="Landscape with default inset"
        style={{ width: 150 }}
      >
        <ImageFrameOverlayPositioner position="bottom-right">
          <ImageFrameOverlay.Indicator>default</ImageFrameOverlay.Indicator>
        </ImageFrameOverlayPositioner>
      </ImageFrame>

      <ImageFrame
        ratio={1}
        rounded
        stroke
        src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
        alt="Landscape with 0 inset"
        style={{ width: 150 }}
      >
        <ImageFrameOverlayPositioner position="bottom-right" inset={0}>
          <ImageFrameOverlay.Indicator>inset=0</ImageFrameOverlay.Indicator>
        </ImageFrameOverlayPositioner>
      </ImageFrame>

      <ImageFrame
        ratio={1}
        rounded
        stroke
        src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
        alt="Landscape with 12 inset"
        style={{ width: 150 }}
      >
        <ImageFrameOverlayPositioner position="bottom-right" inset={12}>
          <ImageFrameOverlay.Indicator>inset=12</ImageFrameOverlay.Indicator>
        </ImageFrameOverlayPositioner>
      </ImageFrame>
    </div>
  );
}
