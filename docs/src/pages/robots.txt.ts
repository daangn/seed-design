import type { APIRoute } from "astro";
import { baseUrl } from "@/lib/metadata";

/**
 * seed-design.io는 Cloudflare 뒤에 있고, CF가 content-signals 주석 블록을 robots.txt에
 * 덧붙인다. 지금까지는 오리진에 robots.txt 자체가 없어서 그 주석만 나가고 크롤러 지시문과
 * Sitemap 참조가 하나도 없었다. 배포 후 실제 병합 결과를 curl로 확인할 것.
 */
export const GET: APIRoute = () =>
  new Response(`User-Agent: *
Allow: /

Sitemap: ${new URL("/sitemap.xml", baseUrl)}
`);
