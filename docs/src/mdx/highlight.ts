/**
 * 빌드 때 코드 문자열을 하이라이트한다(MDX 밖에서 오는 코드: 레지스트리 스니펫, 설치 명령). MDX 코드 블록(rehype-code)과
 * 같은 테마·dual theme 변수(`--shiki-light`/`--shiki-dark`)를 쓰고, `<pre>`에 fumadocs `Pre`의 class를 붙인다.
 * 이 함수를 await하는 `.astro`는 아래에 React 컴포넌트를 두지 않는다(렌더 결정성, DESIGN 핵심 결정 9 ③).
 */
import { codeToHtml } from "shiki";

export function highlightCode(code: string, lang: string): Promise<string> {
  return codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
    transformers: [
      {
        pre(node) {
          this.addClassToHast(node, "min-w-full w-max *:flex *:flex-col");
        },
      },
    ],
  });
}
