import { getLLMMarkdownUrl } from "@/app/_llms/config";
import type { Section } from "@/app/_llms/types";

/**
 * llms.txt v2가 정의한 두 링크 릴레이션을 내보낸다 — `alternate`는 이 페이지의 마크다운 버전을,
 * `describedby`는 그 페이지를 커버하는 llms.txt를 가리킨다.
 *
 * Next `metadata` API의 `alternates`에는 `canonical`/`languages`/`media`/`types` 슬롯만 있어
 * `describedby`를 표현할 수 없다. `JsonLd`와 같은 이유로 여기서 직접 렌더한다.
 *
 * 이 링크가 페이지 액션 메뉴와 별개로 필요한 이유: 메뉴는 `FloatingPortal` 안에 있어 static
 * export HTML에 렌더되지 않는다. 마크다운 URL이 마크업에 남는 자리는 여기뿐이라, 링크 검사도
 * 크롤러도 이 태그를 통해서만 도달한다.
 *
 * @see https://llmstxt.org/
 */
export function LlmsLinkRels({ section, markdownUrl }: { section: Section; markdownUrl: string }) {
  const llmsTxtUrl = getLLMMarkdownUrl(section, []);

  return (
    <>
      {/* 섹션 루트는 자기 자신이 llms.txt라 alternate가 describedby와 같은 URL이 된다. */}
      {markdownUrl === llmsTxtUrl ? null : (
        <link rel="alternate" type="text/markdown" href={markdownUrl} />
      )}
      <link rel="describedby" href={llmsTxtUrl} />
    </>
  );
}
