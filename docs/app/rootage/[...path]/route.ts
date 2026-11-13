import { readFile } from "node:fs/promises";
import { join } from "node:path";
import index from "@seed-design/rootage-artifacts/index.json";

export const dynamic = "force-static";

const rootageData = join(process.cwd(), "..", "packages", "rootage", "__generated__");

export function generateStaticParams() {
  return [
    { path: ["index.json"] },
    ...index.resources.map((resource) => ({
      path: resource.path.replace(/^\//, "").split("/"),
    })),
  ];
}

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;

  const content = await readFile(join(rootageData, ...path), "utf-8");
  return new Response(content, {
    headers: { "content-type": "application/json" },
  });
}
