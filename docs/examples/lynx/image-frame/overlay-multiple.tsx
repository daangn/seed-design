import "./styles";
import { useSeedClassName } from "@seed-design/lynx-react";
import {
  ImageFrame,
  ImageFrameFloater,
  ImageFrameBadge,
  ImageFrameReactionButton,
} from "@seed-design/lynx-react";
import { useState } from "@lynx-js/react";

export default function ImageFrameOverlayMultipleExample() {
  const [liked, setLiked] = useState(false);

  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} image-frame-example`}>
      <ImageFrame
        ratio={1}
        borderRadius="r2"
        stroke
        src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
        alt="Landscape with multiple overlays"
        style={{ width: 200 }}
        fallback={
          <view className="image-frame-fallback">
            <text className="image-frame-fallback-label">이미지</text>
          </view>
        }
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
            accessibility-label="좋아요"
          />
        </ImageFrameFloater>
      </ImageFrame>
    </view>
  );
}
