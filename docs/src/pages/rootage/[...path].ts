import { readFile } from "node:fs/promises";
import { join } from "node:path";
import index from "@seed-design/rootage-artifacts/index.json";
import type { APIRoute, GetStaticPaths } from "astro";

const rootageData = join(process.cwd(), "..", "packages", "rootage", "__generated__");

export const getStaticPaths = (() =>
  ["/index.json", ...index.resources.map((resource) => resource.path)].map((path) => ({
    params: { path: path.replace(/^\//, "") },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute<Record<string, never>, { path: string }> = async ({ params }) => {
  const content = await readFile(join(rootageData, params.path), "utf-8");
  return new Response(content, {
    headers: { "content-type": "application/json" },
  });
};
