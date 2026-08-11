import type { MetadataRoute } from "next";
import { baseUrl } from "@/app/metadata";
import {
  getDocsSource,
  getGetStartedSource,
  getFoundationsSource,
  getComponentsSource,
  getPatternsSource,
  getReactSource,
  getBreezeSource,
  getLynxSource,
  getAiIntegrationSource,
  getUpdatesSource,
} from "@/app/source";
import { getMarkdownPageLastModified } from "@/lib/load-markdown-page";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
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
  ] = await Promise.all([
    getDocsSource(),
    getGetStartedSource(),
    getFoundationsSource(),
    getComponentsSource(),
    getPatternsSource(),
    getReactSource(),
    getBreezeSource(),
    getLynxSource(),
    getAiIntegrationSource(),
    getUpdatesSource(),
  ]);

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
      const lastModified = await getMarkdownPageLastModified(page.absolutePath);

      return {
        url: new URL(page.url, baseUrl).href,
        ...(lastModified && { lastModified: new Date(lastModified) }),
      };
    }),
  );
}
