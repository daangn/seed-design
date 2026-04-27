import { readFile } from "node:fs/promises";
import { join } from "node:path";
import index from "@seed-design/rootage-artifacts/index.json";

export const dynamic = "force-static";

const rootageDist = join(process.cwd(), "..", "packages", "rootage", "dist");

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
  const target = path.join("/");

  if (target === "index.json") {
    return new Response(JSON.stringify(index, null, 2), {
      headers: { "content-type": "application/json" },
    });
  }

  const filePath = join(rootageDist, ...path);
  const content = await readFile(filePath, "utf-8");
  return new Response(content, {
    headers: { "content-type": "application/json" },
  });
}
