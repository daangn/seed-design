import { baseUrl } from "@/app/metadata";
import { getBreezeSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const breezeSource = await getBreezeSource();
  const pages = breezeSource.getPages().filter((page) => page.slugs.length > 0);

  const pageList = pages
    .map((page) => {
      const slugsWithExt = page.slugs.map((s, i) => (i === page.slugs.length - 1 ? `${s}.txt` : s));
      const llmsUrl = new URL(`/llms/breeze/${slugsWithExt.join("/")}`, baseUrl);
      return `- [${page.data.title}](${llmsUrl}): ${page.data.description ?? ""}`;
    })
    .sort()
    .join("\n");

  return new Response(`# SEED Breeze - LLM Reference

프로젝트에 바로 사용할 수 있는 유틸리티 UI 컴포넌트입니다.

## Quick Access

- [전체 문서 (llms-full.txt)](${new URL("/breeze/llms-full.txt", baseUrl)}): 모든 Breeze 문서를 하나의 파일로

## Components

${pageList}

## Related Sections

- [React Library](${new URL("/react/llms.txt", baseUrl)}): React 컴포넌트 라이브러리
- [Design Guidelines](${new URL("/docs/llms.txt", baseUrl)}): 디자인 가이드라인
`);
}
