import { processContent } from "../_llms/process-content";
import { reactSource } from "@/app/source";
import { notFound } from "next/navigation";

export const revalidate = false;

export async function GET() {
  const page = reactSource.getPage(["get-started", "changelog"]);

  if (!page) return notFound();

  const processed = await processContent(page.path, page.data.content);

  const response = `# SEED Design React - Changelog

이 파일은 SEED Design React의 변경사항과 업데이트 내역을 담고 있습니다.
각 버전별 변경사항, 새로운 기능, 버그 수정 등을 확인할 수 있습니다.

${processed}`;

  return new Response(response);
}
