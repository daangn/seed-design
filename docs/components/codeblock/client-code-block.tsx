"use client";

import { defaultShikiFactory } from "fumadocs-core/highlight/shiki/full";
import { useShikiDynamic } from "fumadocs-core/highlight/shiki/react";
import { type ComponentProps, type ReactNode, useId } from "react";
import { SeedCodeBlock } from "./code-block";

/** fumadocs-ui `Pre`와 같은 class(MDX 코드 블록 `CodeBlock.astro`와 같다). */
function Pre(props: ComponentProps<"pre">) {
  return (
    <pre
      {...props}
      className={["min-w-full w-max *:flex *:flex-col", props.className].filter(Boolean).join(" ")}
    />
  );
}

const shikiThemes = { light: "github-light", dark: "github-dark" } as const;

interface SeedClientCodeBlockProps {
  code: string;
  lang: string;
  title?: ReactNode;
  className?: string;
}

/**
 * Client-highlighted single code block, for client-tree surfaces that cannot use the
 * async server highlighter (e.g. the interactive changelog viewer). Uses the same Shiki
 * client hook as Fumadocs' `DynamicCodeBlock`, wrapped in the SEED card chrome.
 */
export function SeedClientCodeBlock({ code, lang, title, className }: SeedClientCodeBlockProps) {
  const id = useId();
  const node = useShikiDynamic(
    () => defaultShikiFactory.getOrInit(),
    code,
    { lang, defaultColor: false, themes: shikiThemes, components: { pre: Pre } },
    [id, lang, code],
  );

  return (
    <SeedCodeBlock title={title} className={className}>
      {node ?? (
        <Pre>
          <code>
            {code.split("\n").map((line, index) => (
              // oxlint-disable-next-line react/no-array-index-key -- static placeholder lines before highlight resolves
              <span className="line" key={index}>
                {line}
              </span>
            ))}
          </code>
        </Pre>
      )}
    </SeedCodeBlock>
  );
}
