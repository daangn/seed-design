import * as Base from "fumadocs-ui/components/codeblock";
import { Fragment } from "react";
import { codeToHast } from "shiki";
import { toJsxRuntime, type Jsx } from "hast-util-to-jsx-runtime";
import { jsx, jsxs } from "react/jsx-runtime";

export interface CodeBlockProps {
  code: string;
  wrapper?: Base.CodeBlockProps;
  lang: "bash" | "ts" | "tsx";
}

export async function CodeBlock({
  code,
  lang,
  wrapper,
}: CodeBlockProps): Promise<React.ReactElement> {
  if (!code) {
    return <div>코드가 없어요.</div>;
  }

  const hast = await codeToHast(code, {
    lang,
    defaultColor: false,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
  });

  const rendered = toJsxRuntime(hast, {
    jsx: jsx as Jsx,
    jsxs: jsxs as Jsx,
    Fragment,
    development: false,
    components: {
      pre: Base.Pre,
    },
  }) as React.ReactElement;

  return (
    <Base.CodeBlock className="[&_.line]:min-h-[20px]" {...wrapper}>
      {rendered}
    </Base.CodeBlock>
  );
}
