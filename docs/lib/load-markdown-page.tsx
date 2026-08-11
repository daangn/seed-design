import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import type { MarkdownRenderer } from "@fumadocs/satteri/local-md";
import { mdxComponents } from "@/components/mdx-components";

interface PageExports extends Record<string, unknown> {
  processed?: string;
}

interface MarkdownPage {
  absolutePath?: string;
  data: {
    load: () => Promise<MarkdownRenderer<PageExports>>;
  };
}

const execFileAsync = promisify(execFile);
const modifiedAtCache = new Map<string, Promise<Date | undefined>>();

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

export async function getMarkdownPageLastModified(
  filePath: string | undefined,
): Promise<Date | undefined> {
  if (!filePath) return undefined;

  const cached = modifiedAtCache.get(filePath);
  if (cached) return cached;

  const pending = (async () => {
    try {
      const { stdout } = await execFileAsync(
        "git",
        ["log", "-1", "--pretty=%ai", path.relative(process.cwd(), filePath)],
        { cwd: process.cwd() },
      );
      const date = new Date(stdout.trim());
      return Number.isNaN(date.getTime()) ? undefined : date;
    } catch {
      return undefined;
    }
  })();

  modifiedAtCache.set(filePath, pending);
  return pending;
}
