import { remarkArchiveLinks } from "@/app/_llms/archive-markdown";
import { REACT_ARCHIVE_VERSION } from "@/lib/docs-archive";
import { typeTableGenerator } from "@/components/type-table/generator";
import { remarkReactTypeTable } from "@/components/type-table/remark-react-type-table";
import { fileGenerator, remarkDocGen } from "fumadocs-docgen";
import { remarkNpm } from "fumadocs-core/mdx-plugins";
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
    .use(remarkReactTypeTable, {
      generator: typeTableGenerator,
      options: { parseDescriptionAsMarkdown: false },
    })
    .use(remarkDocGen, { generators: [fileGenerator()] })
    .use(remarkNpm, { persist: { id: "package-manager" } })
    .use(remarkArchiveLinks, REACT_ARCHIVE_VERSION)
    .use(remarkStringify)
    .process({
      path,
      value: content,
    });

  return String(file);
}
