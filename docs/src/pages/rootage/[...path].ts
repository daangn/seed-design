/**
 * `/rootage/**`: rootage 산출물(`packages/rootage/__generated__`)을 그대로 게시한다. render 중 fs로 읽지 않고
 * raw module로 import한다(module graph에 들어가 incremental build가 변경을 감지한다). 목록은 rootage index다.
 */
import index from "@seed-design/rootage-artifacts/index.json";
import type { APIRoute } from "astro";

const files = import.meta.glob<string>("../../../../packages/rootage/__generated__/**/*.json", {
  query: "?raw",
  import: "default",
  eager: true,
});

function file(path: string): string {
  const content = files[`../../../../packages/rootage/__generated__/${path}`];
  if (content === undefined) throw new Error(`rootage 산출물이 없습니다: ${path}`);
  return content;
}

export function getStaticPaths() {
  return ["/index.json", ...index.resources.map((resource) => resource.path)].map((path) => ({
    params: { path: path.replace(/^\//, "") },
  }));
}

export const GET: APIRoute = ({ params }) =>
  new Response(file(String(params.path)), { headers: { "content-type": "application/json" } });
