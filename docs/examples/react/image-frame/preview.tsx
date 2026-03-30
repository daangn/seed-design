import { ImageFrame } from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

export default function ImageFramePreview() {
  return (
    <ImageFrame
      ratio={4 / 3}
      borderRadius="r2"
      stroke
      src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
      alt="Landscape photograph by Tobias Tullius"
      width="300px"
      fallback={<ContentPlaceholder type="commerce" />}
    />
  );
}
