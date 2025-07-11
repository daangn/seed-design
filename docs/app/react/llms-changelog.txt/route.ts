import { globby } from "globby";
import matter from "gray-matter";
import * as fs from "node:fs/promises";
import { processContent } from "../_llms/process-content";

export const revalidate = false;

export async function GET() {
  const files = await globby(["./content/react/get-started/changelog.mdx"]);

  if (files.length === 0) {
    return new Response("Changelog not found", { status: 404 });
  }

  const fileContent = await fs.readFile(files[0]);
  const { content } = matter(fileContent.toString());
  const processed = await processContent(files[0], content);

  const llmsContent = `# SEED Design React - Changelog

이 파일은 SEED Design React의 변경사항과 업데이트 내역을 담고 있습니다.
각 버전별 변경사항, 새로운 기능, 버그 수정 등을 확인할 수 있습니다.

${processed}`;

  return new Response(llmsContent);
}
