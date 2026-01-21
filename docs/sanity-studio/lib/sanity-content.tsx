"use client";

import { PortableText } from "@portabletext/react";
import { Heading } from "fumadocs-ui/components/heading";
import { PortableTextBlock } from "sanity";
import { SanityCards } from "./card";
import { DoDont } from "./do-dont";
import { ExternalImage } from "./external-image";
import { PortableImage } from "./image";
import { ImageTextHalfPreview } from "./image-text-half";
import { Table } from "./table";

export const PortableContent = ({
  content,
}: {
  content: PortableTextBlock | PortableTextBlock[];
}) => {
  return (
    <PortableText
      components={{
        types: {
          image: PortableImage,
          tabelContainer: Table,
          imageWithText: ImageTextHalfPreview,
          externalImageLink: ExternalImage,
          doDont: DoDont,
          cards: SanityCards,
        },
        block: {
          normal: ({ value, children }) => (
            <p className="min-h-4 m-0" id={value._key}>
              {children}
            </p>
          ),
          h1: ({ value, children }) => (
            <Heading as="h1" id={value._key}>
              {children}
            </Heading>
          ),
          h2: ({ value, children }) => (
            <Heading as="h2" id={value._key}>
              {children}
            </Heading>
          ),
          h3: ({ value, children }) => (
            <Heading as="h3" id={value._key}>
              {children}
            </Heading>
          ),
          h4: ({ value, children }) => (
            <Heading as="h4" id={value._key}>
              {children}
            </Heading>
          ),
          h5: ({ value, children }) => (
            <Heading as="h5" id={value._key}>
              {children}
            </Heading>
          ),
          description: ({ value, children }) => (
            <span className="text-sm" id={value._key}>
              {children}
            </span>
          ),
        },
      }}
      value={content}
    />
  );
};
