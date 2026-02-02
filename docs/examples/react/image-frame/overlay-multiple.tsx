import {
  ImageFrame,
  ImageFrameFloater,
  ImageFrameBadge,
  ImageFrameReactionButton,
} from "@seed-design/react";
import { useState } from "react";

export default function ImageFrameOverlayMultipleExample() {
  const [liked, setLiked] = useState(false);

  return (
    <ImageFrame
      ratio={1}
      borderRadius="r2"
      stroke
      src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
      alt="Landscape with multiple overlays"
      style={{ width: 200 }}
    >
      <ImageFrameFloater placement="top-start">
        <ImageFrameBadge tone="brand" variant="solid">
          NEW
        </ImageFrameBadge>
      </ImageFrameFloater>
      <ImageFrameFloater placement="bottom-end">
        <ImageFrameReactionButton pressed={liked} onPressedChange={setLiked} aria-label="좋아요" />
      </ImageFrameFloater>
    </ImageFrame>
  );
}
