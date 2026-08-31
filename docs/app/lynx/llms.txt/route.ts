import { getLLMMarkdownUrl } from "@/app/_llms/config";
import { baseUrl } from "@/app/metadata";
import { getLynxSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const source = await getLynxSource();
  const pages = source.getPages();

  const pageList = pages
    .map((page) => {
      const llmsUrl = new URL(getLLMMarkdownUrl("lynx", page.slugs), baseUrl);
      return `- [${page.data.title}](${llmsUrl}): ${page.data.description ?? ""}`;
    })
    .sort()
    .join("\n");

  return new Response(`# SEED Lynx - LLM Reference

Lynx 프레임워크 문서입니다.

## Documents

${pageList}

## Related Sections

- [React Library](${new URL("/react/llms.txt", baseUrl)}): React 컴포넌트 라이브러리
- [AI Integration](${new URL("/ai-integration/llms.txt", baseUrl)}): AI 도구 연동 가이드
`);
}
