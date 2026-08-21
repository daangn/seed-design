import { ImageFrame, Flex } from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

export default function ImageFrameFallbackExample() {
  return (
    <Flex gap="x3" wrap="wrap" align="flex-end">
      <ImageFrame
        ratio={1}
        borderRadius="r2"
        stroke
        src="https://invalid-url"
        alt="Fallback with buySell type"
        style={{ width: 120 }}
        fallback={<ContentPlaceholder type="buySell" />}
      />
      <ImageFrame
        ratio={1}
        borderRadius="r2"
        stroke
        src="https://invalid-url"
        alt="Fallback with food type"
        style={{ width: 120 }}
        fallback={<ContentPlaceholder type="food" />}
      />
      <ImageFrame
        ratio={1}
        borderRadius="r2"
        stroke
        src="https://invalid-url"
        alt="Fallback with jobs type"
        style={{ width: 120 }}
        fallback={<ContentPlaceholder type="jobs" />}
      />
    </Flex>
  );
}
