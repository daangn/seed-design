import { ImageFrame, ImageFrameOverlayPositioner, ImageFrameOverlay } from "@seed-design/react";
import { useState } from "react";

export default function ImageFrameOverlayMultipleExample() {
  const [liked, setLiked] = useState(false);

  return (
    <ImageFrame
      ratio={1}
      rounded
      stroke
      src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
      alt="Landscape with multiple overlays"
      style={{ width: 200 }}
    >
      <ImageFrameOverlayPositioner position="top-left">
        <ImageFrameOverlay.Badge tone="brand" variant="solid">
          NEW
        </ImageFrameOverlay.Badge>
      </ImageFrameOverlayPositioner>
      <ImageFrameOverlayPositioner position="bottom-right">
        <ImageFrameOverlay.ReactionButton
          pressed={liked}
          onPressedChange={setLiked}
          aria-label="좋아요"
        />
      </ImageFrameOverlayPositioner>
    </ImageFrame>
  );
}
