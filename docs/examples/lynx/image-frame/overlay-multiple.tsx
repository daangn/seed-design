import "./styles";
import {
  ImageFrame,
  ImageFrameFloater,
  ImageFrameBadge,
  ImageFrameReactionButton,
} from "@seed-design/lynx-react";
import { useState } from "@lynx-js/react";

export default function ImageFrameOverlayMultipleExample() {
  const [liked, setLiked] = useState(false);

  return (
    <ImageFrame
      ratio={1}
      borderRadius="r2"
      stroke
      src="https://avatars.githubusercontent.com/u/54893898?v=4"
      alt="Profile with multiple overlays"
      style={{ width: "200px" }}
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
  );
}
