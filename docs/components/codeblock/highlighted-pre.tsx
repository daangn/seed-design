import { highlight } from "fumadocs-core/highlight";
import { Pre } from "fumadocs-ui/components/codeblock";

const shikiThemes = { light: "github-light", dark: "github-dark" } as const;

/**
 * 빌드 시점에 Shiki로 하이라이트한 `<pre>`. Astro가 정적으로 렌더링해 코드 카드 island의 slot으로
 * 넘기므로 브라우저 번들에는 들어가지 않는다.
 */
export async function HighlightedPre({ code, lang }: { code: string; lang: string }) {
  return highlight(code, {
    lang,
    themes: shikiThemes,
    defaultColor: false,
    components: { pre: Pre },
  });
}
