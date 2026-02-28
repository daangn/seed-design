import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import type { MDXComponents } from "mdx/types";
import clsx from "clsx";

function toInternalSeedHref(href: string): string | null {
  if (href.startsWith("/")) {
    return href;
  }

  try {
    const parsed = new URL(href);
    const isSeedDomain =
      parsed.hostname === "seed-design.io" || parsed.hostname === "www.seed-design.io";

    if (!isSeedDomain) return null;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
}

function isAllowedSeedHref(href: string): boolean {
  if (href.startsWith("/")) {
    return true;
  }

  try {
    const parsed = new URL(href);
    return parsed.hostname === "seed-design.io" || parsed.hostname === "www.seed-design.io";
  } catch {
    return false;
  }
}

function CompactHeading({ className, ...rest }: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      className={clsx("text-[13px] font-semibold leading-[1.45] mt-2 mb-1", className)}
      {...rest}
    />
  );
}

export const chatMdxComponents: MDXComponents = {
  h1: CompactHeading,
  h2: CompactHeading,
  h3: CompactHeading,
  h4: CompactHeading,
  h5: CompactHeading,
  h6: CompactHeading,
  p: ({ className, ...rest }) => (
    <p className={clsx("text-[13px] leading-[1.45] my-1.5", className)} {...rest} />
  ),
  strong: ({ className, ...rest }) => (
    <strong className={clsx("font-semibold", className)} {...rest} />
  ),
  em: ({ className, ...rest }) => <em className={clsx("italic", className)} {...rest} />,
  code: ({ className, ...rest }) => (
    <code
      className={clsx(
        "text-[12px] px-1 py-[1px] rounded-sm bg-fd-muted text-fd-foreground break-all",
        className,
      )}
      {...rest}
    />
  ),
  a: ({ href, className, ...rest }) => {
    if (typeof href !== "string") {
      return <span className={clsx("break-all", className)} {...rest} />;
    }

    const internalHref = toInternalSeedHref(href);
    if (internalHref) {
      return (
        <Link
          href={internalHref}
          className={clsx("text-fd-primary underline underline-offset-2 break-all", className)}
          {...rest}
        />
      );
    }

    if (!isAllowedSeedHref(href)) {
      return <span className={clsx("break-all", className)} {...rest} />;
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={clsx("text-fd-primary underline underline-offset-2 break-all", className)}
        {...rest}
      />
    );
  },
  ol: ({ className, ...rest }) => (
    <ol
      className={clsx("list-decimal pl-4 my-1.5 text-[13px] leading-[1.45] space-y-1", className)}
      {...rest}
    />
  ),
  ul: ({ className, ...rest }) => (
    <ul
      className={clsx("list-disc pl-4 my-1.5 text-[13px] leading-[1.45] space-y-1", className)}
      {...rest}
    />
  ),
  li: ({ className, ...rest }) => (
    <li className={clsx("text-[13px] leading-[1.45]", className)} {...rest} />
  ),
  blockquote: ({ className, ...rest }) => (
    <blockquote
      className={clsx(
        "border-l-2 border-fd-border pl-2 text-[12px] text-fd-muted-foreground my-1.5",
        className,
      )}
      {...rest}
    />
  ),
  hr: ({ className, ...rest }) => (
    <hr className={clsx("my-2 border-fd-border", className)} {...rest} />
  ),
};
