import { typeTableProject } from "@/components/type-table/project";
import { remarkReactTypeTable } from "@/components/type-table/remark-react-type-table";
import { fileGenerator, remarkDocGen, remarkInstall } from "fumadocs-docgen";
import { remarkInclude } from "fumadocs-mdx/config";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkStringify from "remark-stringify";

export async function processContent(path: string, content: string): Promise<string> {
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
