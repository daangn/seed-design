import type { MetadataRoute } from "next";
import { baseUrl } from "@/app/metadata";
import {
  docsSource,
  getStartedSource,
  foundationsSource,
  componentsSource,
  patternsSource,
  reactSource,
  breezeSource,
  lynxSource,
  aiIntegrationSource,
  updatesSource,
} from "@/app/source";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return await Promise.all(
    [
      ...docsSource.getPages(),
      ...getStartedSource.getPages(),
      ...foundationsSource.getPages(),
      ...componentsSource.getPages(),
      ...patternsSource.getPages(),
      ...reactSource.getPages(),
      ...breezeSource.getPages(),
      ...lynxSource.getPages(),
      ...aiIntegrationSource.getPages(),
      ...updatesSource.getPages(),
    ].map(async (page) => {
      const { lastModified } = await page.data.load();

      return {
        url: new URL(page.url, baseUrl).href,
        ...(lastModified && { lastModified: new Date(lastModified) }),
      };
    }),
  );
}
