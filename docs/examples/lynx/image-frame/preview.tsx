import "./styles";
import { ImageFrame } from "@seed-design/lynx-react";

export default function ImageFramePreview() {
  return (
    <ImageFrame
      ratio={4 / 3}
      borderRadius="r2"
      stroke
      src="https://avatars.githubusercontent.com/u/54893898?v=4"
      alt="프로필 이미지"
      width="300px"
      fallback={
        <view className="image-frame-fallback">
          <text className="image-frame-fallback-label">이미지</text>
        </view>
      }
    />
  );
}
