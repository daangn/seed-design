import type { APIRoute } from "astro";
import { baseUrl } from "@/lib/metadata";
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
} from "@/lib/source";
import { getMarkdownPageLastModified } from "@/lib/git-timestamps";

export const GET: APIRoute = async () => {
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

  const urls = await Promise.all(
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
      const lastmod = lastModified ? `<lastmod>${lastModified.toISOString()}</lastmod>\n` : "";

      return `<url>\n<loc>${new URL(page.url, baseUrl).href}</loc>\n${lastmod}</url>\n`;
    }),
  );

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("")}</urlset>\n`,
    { headers: { "Content-Type": "application/xml" } },
  );
};
