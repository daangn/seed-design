"use client";

import { defaultShikiFactory } from "fumadocs-core/highlight/shiki/full";
import { useShikiDynamic } from "fumadocs-core/highlight/shiki/react";
import { Pre } from "fumadocs-ui/components/codeblock";
import { type ReactNode, useId } from "react";
import { SeedCodeBlock } from "./code-block";

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
              // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder lines before highlight resolves
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
