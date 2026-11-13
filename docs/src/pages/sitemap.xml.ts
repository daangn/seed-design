/**
 * `/sitemap.xml`. 이 빌드의 모든 섹션 페이지와 Git 수정일. 형식은 기존 Next `app/sitemap.ts` 출력과 같다.
 * cacheKey가 없어 incremental build에서도 매번 렌더링한다.
 */
import type { APIRoute } from "astro";
import { baseUrl } from "../../lib/metadata";
import { sectionsForBuild } from "../content/sections";
import { listPages } from "../content/source";

export const GET: APIRoute = async () => {
  const pages = (
    await Promise.all(sectionsForBuild().map((section) => listPages(section.id)))
  ).flat();
  const urls = pages.map((page) => {
    const lastmod = page.lastModified
      ? `<lastmod>${page.lastModified.toISOString()}</lastmod>\n`
      : "";
    return `<url>\n<loc>${new URL(page.url, baseUrl).href}</loc>\n${lastmod}</url>\n`;
  });

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("")}</urlset>\n`,
    { headers: { "Content-Type": "application/xml" } },
  );
};
