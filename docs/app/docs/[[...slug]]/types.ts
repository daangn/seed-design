import { source } from "@/app/source";
import { InferPageType } from "fumadocs-core/source";
import { PortableTextBlock } from "sanity";

export type PageData = InferPageType<typeof source>["data"];

export interface Guide {
  slug: {
    current: string;
    _type: "slug";
  };
  publishedAt: string;
  content: PortableTextBlock | PortableTextBlock[];
  toc?: {
    _key: string;
    level: number;
    style?: string;
  }[];
}
