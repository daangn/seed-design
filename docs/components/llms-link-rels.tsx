/**
 * llms.txt v2의 `alternate` 링크 릴레이션으로 이 페이지의 마크다운 버전을 가리킨다.
 *
 * 같은 규약의 `describedby`는 내지 않는다. 그 릴레이션이 가리킬 문서 목록 llms.txt를 이 사이트는
 * 발행하지 않는다.
 *
 * 이 링크가 페이지 액션 메뉴와 별개로 필요한 이유: 메뉴는 `FloatingPortal` 안에 있어 static
 * export HTML에 렌더되지 않는다. 마크다운 URL이 마크업에 남는 자리는 여기뿐이라, 링크 검사도
 * 크롤러도 이 태그를 통해서만 도달한다.
 *
 * @see https://llmstxt.org/
 */
export function LlmsLinkRels({ markdownUrl }: { markdownUrl: string }) {
  return <link rel="alternate" type="text/markdown" href={markdownUrl} />;
}
