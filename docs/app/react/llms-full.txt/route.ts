import { processContent } from "@/app/react/_llms/process-content";
import { reactSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const pages = reactSource
    .getPages()
    .filter(({ path }) => {
      if (["(updates-and-migration)/updates/changelog.mdx", "index.mdx"].includes(path))
        return false;

      return true;
    })
    // components/** -> getting-started/** -> iconography/**
    .sort((a, b) => a.path.localeCompare(b.path));

  const results = await Promise.all(
    pages.map(async (page) => {
      const rawContent = await page.data.getText("raw");
      const processed = await processContent(page.path, rawContent || "");

      return `file: ${page.path}

# ${page.data.title}

${page.data.description ?? ""}

${processed}`;
    }),
  );

  return new Response(results.join("\n\n"));
}
