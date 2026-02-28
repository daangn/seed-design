import Link from "next/link";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import defaultMdxComponents from "fumadocs-ui/mdx";
import clsx from "clsx";
import type { MDXComponents } from "mdx/types";

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

export const sharedMdxComponents: MDXComponents = {
  ...defaultMdxComponents,

  img: ({ className, ...rest }) => (
    <ImageZoom
      className={clsx(
        className,
        "bg-palette-gray-100 dark:bg-palette-gray-900 rounded-r2 overflow-hidden",
      )}
      {...rest}
    />
  ),

  a: ({ href, ...rest }) => {
    if (typeof href !== "string") {
      return <a {...rest} />;
    }

    const internalHref = toInternalSeedHref(href);
    if (internalHref) {
      return <Link href={internalHref} {...rest} />;
    }

    return <a href={href} {...rest} />;
  },
};
