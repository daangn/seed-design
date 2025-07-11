import { readFile } from "fs/promises";
import { join } from "path";

export const revalidate = false;

export async function GET() {
  try {
    const changelogPath = join(process.cwd(), "docs/content/react/get-started/changelog.mdx");
    const changelogContent = await readFile(changelogPath, "utf-8");

    // MDX frontmatter 제거하고 순수 텍스트로 변환
    const contentWithoutFrontmatter = changelogContent.replace(/^---\n[\s\S]*?\n---\n/, "");

    const llmsContent = `# SEED Design React - Changelog

이 파일은 SEED Design React의 변경사항과 업데이트 내역을 담고 있습니다.
각 버전별 변경사항, 새로운 기능, 버그 수정 등을 확인할 수 있습니다.

${contentWithoutFrontmatter}`;

    return new Response(llmsContent, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error reading changelog:", error);
    return new Response("Error reading changelog", { status: 500 });
  }
}
