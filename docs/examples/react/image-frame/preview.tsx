import { IconPictureFill } from "@karrotmarket/react-monochrome-icon";
import { AspectRatio } from "@seed-design/react";
import { ImageFrame } from "seed-design/ui/image-frame";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

export default function ImageFramePreview() {
  return (
    <AspectRatio ratio={4 / 3} style={{ width: 300 }}>
      <ImageFrame
        borderRadius="r2"
        stroke
        src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
        alt="Landscape photograph by Tobias Tullius"
        fallback={<ContentPlaceholder svg={<IconPictureFill />} />}
      />
    </AspectRatio>
  );
}
