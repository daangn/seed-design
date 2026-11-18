import type { APIRoute } from "astro";
import { baseUrl } from "../../lib/metadata";

/**
 * seed-design.io는 Cloudflare 뒤에 있고, CF가 content-signals 주석 블록을 robots.txt에
 * 덧붙인다. 오리진의 이 파일이 크롤러 지시문과 Sitemap 참조를 준다. 내용은 기존 Next `app/robots.ts` 출력과 같다.
 */
export const GET: APIRoute = () =>
  new Response(`User-Agent: *
Allow: /

Sitemap: ${new URL("/sitemap.xml", baseUrl)}
`);
