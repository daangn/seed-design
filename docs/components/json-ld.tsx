/**
 * schema.org JSON-LD를 `<script type="application/ld+json">`으로 내보낸다.
 *
 * Next의 `metadata` API에는 구조화 데이터 슬롯이 없어서 script 태그를 직접 렌더하는 게 정석이다.
 * 데이터는 `lib/seo.ts`의 `buildDocsPageJsonLd()`가 만든다.
 */
export function JsonLd({ data }: { data: object }) {
  // JSON.stringify는 `<`를 이스케이프하지 않는다. frontmatter description에 마크업이
  // 들어가는 경우가 실제로 있어서(예: content/lynx/hooks/use-seed-class-name.mdx의
  // `<page>`), `</script>`가 섞이면 브라우저가 script를 조기 종료하고 뒤를 HTML로 해석한다.
  // 유니코드 이스케이프는 JSON 문자열 안에서 동등하므로 JSON-LD 의미는 그대로다.
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD는 script 태그 본문으로만 표현 가능하다
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
