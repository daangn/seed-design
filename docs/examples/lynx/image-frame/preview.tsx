import "./styles";
import { useSeedClassName } from "@seed-design/lynx-react";
import { ImageFrame } from "@seed-design/lynx-react";

export default function ImageFramePreview() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} image-frame-example`}>
      <ImageFrame
        ratio={4 / 3}
        borderRadius="r2"
        stroke
        src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
        alt="Landscape photograph by Tobias Tullius"
        width="300px"
        fallback={
          <view className="image-frame-fallback">
            <text className="image-frame-fallback-label">이미지</text>
          </view>
        }
      />
    </view>
  );
}
