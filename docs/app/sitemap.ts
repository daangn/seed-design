import type { MetadataRoute } from "next";
import { baseUrl } from "@/app/metadata";
import {
  docsSource,
  reactSource,
  breezeSource,
  lynxSource,
  aiIntegrationSource,
} from "@/app/source";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return await Promise.all(
    [
      ...docsSource.getPages(),
      ...reactSource.getPages(),
      ...breezeSource.getPages(),
      ...lynxSource.getPages(),
      ...aiIntegrationSource.getPages(),
    ].map(async (page) => {
      const { lastModified } = await page.data.load();

      return {
        url: new URL(page.url, baseUrl).href,
        ...(lastModified && { lastModified: new Date(lastModified) }),
      };
    }),
  );
}
