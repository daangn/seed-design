import { processContent } from "@/app/react/_llms/process-content";
import { reactSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const pages = reactSource
    .getPages()
    .filter(({ path }) => {
      if (["get-started/changelog.mdx", "index.mdx"].includes(path)) return false;

      return true;
    })
    // components/** -> get-started/** -> iconography/**
    .sort((a, b) => a.path.localeCompare(b.path));

  const results = await Promise.all(
    pages.map(async (page) => {
      const processed = await processContent(page.path, page.data.content);

      return `file: ${page.path}

# ${page.data.title}

${page.data.description ?? ""}

${processed}`;
    }),
  );

  return new Response(results.join("\n\n"));
}
