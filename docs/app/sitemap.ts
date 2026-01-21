import type { MetadataRoute } from "next";
import { baseUrl } from "@/app/metadata";
import { getDocsSource } from "@/app/sources/docs-source";
import { getReactSource } from "@/app/sources/react-source";
import { getBreezeSource } from "@/app/sources/breeze-source";
import { getLynxSource } from "@/app/sources/lynx-source";
import { getAiIntegrationSource } from "./sources/ai-integration-source";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [docsSource, reactSource, breezeSource, lynxSource, aiIntegrationSource] =
    await Promise.all([
      getDocsSource(),
      getReactSource(),
      getBreezeSource(),
      getLynxSource(),
      getAiIntegrationSource(),
    ]);

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
