"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { ImageFrame, type ImageFrameProps } from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

function ImageFramePreview({
  ratio,
  borderRadius,
  stroke,
  src,
}: {
  /** 이미지의 비율 (width / height) */
  ratio?: number;
  borderRadius?: ImageFrameProps["borderRadius"];
  stroke?: boolean;
  /** 비워두면 fallback(ContentPlaceholder)이 보입니다 */
  src?: string;
}) {
  return (
    <ImageFrame
      ratio={ratio}
      borderRadius={borderRadius}
      stroke={stroke}
      src={src ?? ""}
      alt="Landscape photograph by Tobias Tullius"
      width="300px"
      fallback={<ContentPlaceholder type="commerce" />}
    />
  );
}

export const story = defineStory({
  displayName: "ImageFrame",
  Component: withStoryPreview()(ImageFramePreview),
  args: {
    initial: {
      ratio: 4 / 3,
      borderRadius: "r2",
      stroke: true,
      src: "https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
