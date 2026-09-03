import type { MetadataRoute } from "next";
import { sectionSources } from "@/app/_llms/sources";
import { baseUrl } from "@/app/metadata";
import { getMarkdownPageLastModified } from "@/lib/git-timestamps";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sources = await Promise.all(Object.values(sectionSources).map((getSource) => getSource()));

  return await Promise.all(
    sources
      .flatMap((source) => source.getPages())
      .map(async (page) => {
        const lastModified = await getMarkdownPageLastModified(page.absolutePath);

        return {
          url: new URL(page.url, baseUrl).href,
          ...(lastModified && { lastModified: new Date(lastModified) }),
        };
      }),
  );
}
