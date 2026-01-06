import { remarkFigmaImage } from "@/components/figma-image/remark-figma-image";
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
    .use(remarkNpm, { persist: { id: "package-manager" } })
    .use(remarkFigmaImage, {
      fileKey: process.env.FIGMA_FILE_KEY!,
      accessToken: process.env.FIGMA_PERSONAL_ACCESS_TOKEN!,
      fetchUrlsOptions: {
        format: "png",
        scale: 2,
      },
    })
    .use(remarkStringify)
    .process({
      path,
      value: content,
    });

  return String(file);
}
