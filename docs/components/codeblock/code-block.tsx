import clsx from "clsx";
import type { ReactNode } from "react";
import {
  CodeCardDivider,
  codeCardClassName,
  codeCardHeaderClassName,
  codeViewportClassName,
} from "./code-card";
import { CopyButton } from "./copy-button";

interface SeedCodeBlockProps {
  title?: ReactNode;
  icon?: ReactNode;
  className?: string;
  /** Highlighted code, typically a Fumadocs `<Pre>` element. */
  children: ReactNode;
}

/**
 * Presentational single code block card (Figma "Codeblock"). Contains no highlighting
 * logic, so it is safe to render from both server and client trees.
 *
 * With a `title` (filename), it shows a header row (icon + title + copy) and a divider.
 * Without one, the header is omitted and the copy button floats at the top-right of the
 * code, matching Fumadocs' original title-less behavior.
 */
export function SeedCodeBlock({ title, icon, className, children }: SeedCodeBlockProps) {
  const hasHeader = Boolean(title);

  return (
    <figure data-code-card className={clsx(codeCardClassName, !hasHeader && "relative", className)}>
      {hasHeader ? (
        <>
          <div className={codeCardHeaderClassName}>
            {icon ? (
              typeof icon === "string" ? (
                <span
                  className="flex size-x4 shrink-0 items-center text-fg-neutral-muted [&_svg]:size-full"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: fumadocs passes the code icon as an SVG string
                  dangerouslySetInnerHTML={{ __html: icon }}
                />
              ) : (
                <span className="flex size-x4 shrink-0 items-center text-fg-neutral-muted [&_svg]:size-full">
                  {icon}
                </span>
              )
            ) : null}
            <figcaption className="flex-1 truncate text-[0.8125rem] text-fg-neutral-muted">
              {title}
            </figcaption>
            <CopyButton />
          </div>
          <CodeCardDivider />
        </>
      ) : (
        <CopyButton className="absolute top-2 right-2 z-[1] rounded-r1 bg-bg-layer-default shadow-s1" />
      )}
      {/* biome-ignore lint/a11y/useSemanticElements: the scrollable code viewport must follow the Fumadocs keyboard region contract. */}
      <div
        role="region"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: keyboard users need to focus and scroll overflowing code.
        tabIndex={0}
        aria-label={typeof title === "string" ? title : undefined}
        className={codeViewportClassName}
      >
        {children}
      </div>
    </figure>
  );
}
