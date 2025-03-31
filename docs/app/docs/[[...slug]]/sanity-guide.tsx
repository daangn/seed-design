import { client } from "@/sanity/lib/client";
import { GUIDELINE_QUERY } from "@/sanity/lib/queries";
import { PortableText, PortableTextBlock } from "@portabletext/react";
import { TableOfContents } from "fumadocs-core/server";
import { Guide } from "./types";

function getPath(slug: string[]) {
  return slug.join("/");
}

function styleToLevel(style: unknown) {
  if (typeof style !== "string") return;
  return Number.parseInt(style.split("h")[1]);
}

export interface SanityGuideData {
  content: Guide;
  toc: TableOfContents;
}

export async function fetchSanityGuide(
  slug: string[] = [],
  options: {
    perspective?: "published" | "drafts";
  } = {},
): Promise<SanityGuideData> {
  const path = getPath(slug);
  const content = await client.fetch<Guide>(
    GUIDELINE_QUERY,
    { path },
    { cache: "no-store", ...options },
  );
  const toc =
    content?.toc?.map((item) => {
      return {
        depth: item.level ?? styleToLevel(item.style) ?? 0,
        title: (
          <PortableText
            value={{
              ...(item as PortableTextBlock),
              style: undefined,
            }}
          />
        ),
        url: `#${item._key}`,
      };
    }) ?? [];

  return {
    content,
    toc,
  };
}
