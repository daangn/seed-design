import { buildComponentSearchIndex } from "@/lib/component-search-index";

// it should be cached forever
export const revalidate = false;

// `output: "export"` emits this as a static JSON file, like /api/search next to it.
export const dynamic = "force-static";

export async function GET() {
  return Response.json(await buildComponentSearchIndex());
}
