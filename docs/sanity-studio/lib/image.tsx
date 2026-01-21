"use client";

import type { PortableTextTypeComponentProps } from "@portabletext/react";
import { getImageDimensions, SanityImageAsset } from "@sanity/asset-utils";
import imageUrlBuilder from "@sanity/image-url";
import clsx from "clsx";
import { client } from "./client";
import { SanityImageType } from "./types";

const builder = imageUrlBuilder(client);

interface ImageProps {
  value: SanityImageAsset;
  className?: string;
}

export const SanityImage = ({ value, className }: ImageProps) => {
  if (!value) {
    return <div className={`${className} bg-gray-200`} />;
  }

  const cdnUrl = builder
    .image(value)
    .width(1000)
    .fit("max")
    .quality(95)
    .auto("format")
    .format("webp")
    .url();

  return (
    <img
      src={cdnUrl}
      alt={value.originalFilename}
      className={clsx("w-full rounded-2xl overflow-hidden object-cover", className)}
      loading="lazy"
      draggable={false}
    />
  );
};

export const PortableImage = ({ value }: PortableTextTypeComponentProps<SanityImageType>) => {
  if (!value || !value?.asset) {
    return null;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const { aspectRatio } = getImageDimensions(value as any);

  // Sanity CDN URL 생성
  const cdnUrl = builder.image(value).width(1200).fit("max").quality(85).auto("format").url();

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const alt = (value as any)?.alt || " ";

  return (
    <img
      draggable={false}
      src={cdnUrl}
      alt={alt}
      srcSet={`
        ${builder.image(value).width(400).quality(85).fit("max").auto("format").url()} 400w,
        ${builder.image(value).width(796).quality(85).fit("max").auto("format").url()} 796w,
        ${builder.image(value).width(1600).quality(85).fit("max").auto("format").url()} 1600w
        `}
      sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 796px"
      loading="lazy"
      className="w-full h-auto rounded-2xl overflow-hidden my-4 object-cover"
      style={{
        aspectRatio,
      }}
    />
  );
};
