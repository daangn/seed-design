import { globby } from "globby";
import matter from "gray-matter";
import * as fs from "node:fs/promises";
import { processContent } from "../_llms/process-content";

export const revalidate = false;

export async function GET() {
  const files = await globby(["./content/react/**/*.mdx", "!./content/react/index.mdx"]);

  const results = await Promise.all(
    files.map(async (file) => {
      const fileContent = await fs.readFile(file);
      const { content, data } = matter(fileContent.toString());

      const processed = await processContent(file, content);
      return `file: ${file}
# ${data.title}

${data.description ?? ""}
        
${processed}`;
    }),
  );

  return new Response(results.join("\n\n"));
}
