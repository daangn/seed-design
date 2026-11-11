import { getMarkdownPageLastModified } from "@/lib/git-timestamps";
import { resolveCoverImage } from "@/lib/seo";

interface SourcePage {
  slugs: string[];
}

/** 섹션 `[...slug].astro`의 `getStaticPaths`. source의 모든 페이지를 route로 만든다. */
export async function docsStaticPaths<Page extends SourcePage>(
  getSource: () => Promise<{ getPages(): Page[] }>,
  routeSlug: (slug: string[]) => string[] = (slug) => slug,
) {
  const source = await getSource();
  return source.getPages().map((page) => ({
    params: { slug: routeSlug(page.slugs).join("/") || undefined },
    props: { page },
  }));
}

interface LoadablePage<Body, Toc> {
  absolutePath?: string;
  data: { load(): Promise<{ body: Body; toc: Toc }> };
}

/** MDX 본문과 TOC, Git 수정일을 함께 읽는다. */
export async function loadDocsPage<Body, Toc>(page: LoadablePage<Body, Toc>) {
  const [{ body, toc }, lastModified] = await Promise.all([
    page.data.load(),
    getMarkdownPageLastModified(page.absolutePath),
  ]);

  return { Content: body, toc, lastModified };
}

/** frontmatter cover 경로를 본문 상단 커버 이미지 props로 바꾼다. */
export function coverImageProps(coverBase: string | undefined, alt: string) {
  if (!coverBase) return undefined;
  const cover = resolveCoverImage(coverBase);

  return { src: cover.thumbnail, alt, width: cover.og.width, height: cover.og.height };
}
