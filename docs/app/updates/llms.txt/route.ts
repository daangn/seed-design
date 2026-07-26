import { getLLMMarkdownUrl, sectionConfigs, shouldIncludeInFullText } from "@/app/_llms/config";
import { getDisplayTitle } from "@/app/_llms/utils";
import { baseUrl } from "@/app/metadata";
import { updatesSource } from "@/app/source";

export const revalidate = false;

/** 정렬 전용. publishedAt은 프론트매터 파싱에 따라 문자열/Date 양쪽으로 온다. */
function publishedTime(page: { data: { publishedAt?: string | Date } }): number {
  return page.data.publishedAt ? new Date(page.data.publishedAt).getTime() : 0;
}

export async function GET() {
  // updates는 섹션 인덱스 mdx가 없어 excludePaths도 비어있다(랜딩은 app/updates/page.tsx).
  const pages = updatesSource
    .getPages()
    .filter((page) => shouldIncludeInFullText("updates", page.path));

  // 글 목록이라 slug 알파벳순은 의미가 없다. 발행일 최신순으로 세운다.
  const pageList = pages
    .sort((a, b) => publishedTime(b) - publishedTime(a))
    .map((page) => {
      const displayTitle = getDisplayTitle(page, pages);
      const llmsUrl = new URL(getLLMMarkdownUrl("updates", page.slugs), baseUrl);
      const description = page.data.description ? `: ${page.data.description}` : "";
      return `- [${displayTitle}](${llmsUrl})${description}`;
    })
    .join("\n");

  return new Response(`# SEED Updates - LLM Reference

${sectionConfigs.updates.description}

## Posts

${pageList}

## Related Sections

- [Changelog](${new URL("/llms/react/updates/changelog.txt", baseUrl)}): 패키지별/버전별 변경 이력
- [React Library](${new URL("/react/llms.txt", baseUrl)}): React 컴포넌트 라이브러리
`);
}
