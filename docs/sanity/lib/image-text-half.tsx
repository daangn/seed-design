"use client";

import { PortableTextBlock } from "sanity";
import { SanityImageAsset } from "@sanity/asset-utils";
import imageUrlBuilder from "@sanity/image-url";
import { useCallback } from "react";
import { client } from "./client";
import { PortableContent } from "./sanity-content";

const builder = imageUrlBuilder(client);

interface SanityImage {
  _type: "image";
  asset: SanityImageAsset;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

interface ImageTextHalfPreviewProps {
  value: {
    image: SanityImage;
    text: PortableTextBlock[];
    imagePosition: "left" | "right";
  };
}

export function ImageTextHalfPreview({ value }: ImageTextHalfPreviewProps) {
  const { image, text, imagePosition = "left" } = value;
  const imageUrl = useCallback(() => {
    if (!image) {
      return null;
    }
    return builder.image(image).width(800).url();
  }, [image]);

  return (
    <div
      style={{
        marginTop: "24px",
      }}
      className={`flex flex-col gap-6 ${imagePosition === "left" ? "sm:flex-row-reverse" : "sm:flex-row"}`}
    >
      <div style={{ flex: 1, padding: 4 }}>
        <PortableContent content={text} />
      </div>
      <div className="flex-1 w-full sm:max-w-[50%] rounded-2xl my-4">
        <img
          src={imageUrl() ?? undefined}
          alt=""
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            margin: 0,
          }}
        />
      </div>
    </div>
  );
}
