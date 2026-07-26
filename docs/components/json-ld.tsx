/**
 * schema.org JSON-LD를 `<script type="application/ld+json">`으로 내보낸다.
 *
 * Next의 `metadata` API에는 구조화 데이터 슬롯이 없어서 script 태그를 직접 렌더하는 게 정석이다.
 * 데이터는 `lib/seo.ts`의 `buildDocsPageJsonLd()`가 만든다.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD는 script 태그 본문으로만 표현 가능하다
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
