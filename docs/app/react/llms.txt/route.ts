import { typeTableProject } from "@/components/type-table/project";
import { remarkReactTypeTable } from "@/components/type-table/remark-react-type-table";
import { fileGenerator, remarkDocGen, remarkInstall } from "fumadocs-docgen";
import { remarkInclude } from "fumadocs-mdx/config";
import { globby } from "globby";
import matter from "gray-matter";
import * as fs from "node:fs/promises";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkStringify from "remark-stringify";

export const revalidate = false;

export async function GET() {
  const files = await globby(["./content/react/**/*.mdx", "!./content/react/index.mdx"]);

  // Process files in chunks to prevent OOM
  const CHUNK_SIZE = 10;
  const results: string[] = [];

  for (let i = 0; i < files.length; i += CHUNK_SIZE) {
    const chunk = files.slice(i, i + CHUNK_SIZE);

    const chunkPromises = chunk.map(async (file) => {
      const fileContent = await fs.readFile(file);
      const { content, data } = matter(fileContent.toString());

      const processed = await processContent(file, content);
      return `file: ${file}
# ${data.title}

${data.description ?? ""}
        
${processed}`;
    });

    // Process this chunk and wait for completion before moving to next chunk
    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults);
  }

  return new Response(results.join("\n\n"));
}

async function processContent(path: string, content: string): Promise<string> {
  const file = await remark()
    .use(remarkMdx)
    .use(remarkInclude)
    .use(remarkGfm)
    .use(remarkReactTypeTable, { options: { project: typeTableProject } })
    .use(remarkDocGen, { generators: [fileGenerator()] })
    .use(remarkInstall, { persist: { id: "package-manager" } })
    .use(remarkStringify)
    .process({
      path,
      value: content,
    });

  return String(file);
}
