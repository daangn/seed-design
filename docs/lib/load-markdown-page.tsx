import type { MarkdownRenderer } from "@fumadocs/satteri/local-md";
import { mdxComponents } from "@/components/mdx-components";
import { getMarkdownPageLastModified } from "@/lib/git-timestamps";

interface PageExports extends Record<string, unknown> {
  processed?: string;
}

interface MarkdownPage {
  absolutePath?: string;
  data: {
    load: () => Promise<MarkdownRenderer<PageExports>>;
  };
}

/** Satteri renderer에 공통 MDX 컴포넌트와 Git 수정일을 연결합니다. */
export async function loadMarkdownPage(page: MarkdownPage) {
  const renderer = await page.data.load();
  const [rendered, lastModified] = await Promise.all([
    renderer.render(mdxComponents),
    getMarkdownPageLastModified(page.absolutePath),
  ]);

  return {
    body: rendered.body,
    toc: rendered.toc,
    structuredData: renderer.structuredData,
    processed: rendered.exports.processed,
    lastModified,
  };
}
