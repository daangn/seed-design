import { AspectRatio } from "@seed-design/react";
import {
  ImageFrameBadge,
  ImageFrame,
  ImageFrameFloater,
  ImageFrameReactionButton,
} from "seed-design/ui/image-frame";
import { useState } from "react";

export default function ImageFrameOverlayMultipleExample() {
  const [liked, setLiked] = useState(false);

  return (
    <AspectRatio ratio={1} style={{ width: 200 }}>
      <ImageFrame
        borderRadius="r2"
        stroke
        src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
        alt="Landscape with multiple overlays"
      >
        <ImageFrameFloater placement="top-start">
          <ImageFrameBadge tone="brand" variant="solid">
            NEW
          </ImageFrameBadge>
        </ImageFrameFloater>
        <ImageFrameFloater placement="bottom-end">
          <ImageFrameReactionButton
            pressed={liked}
            onPressedChange={setLiked}
            aria-label="좋아요"
          />
        </ImageFrameFloater>
      </ImageFrame>
    </AspectRatio>
  );
}
