import NextLink from "next/link";
import type { ComponentProps } from "react";

type SiteLinkProps = Omit<ComponentProps<"a">, "href"> & { href: string };

// Absolute URLs may belong to another Next build on the same domain (latest vs archive).
// Use a document navigation so that build can load its own router and assets.
export function SiteLink({ href, ...props }: SiteLinkProps) {
  return /^(?:[a-z][\w+.-]*:|\/\/)/i.test(href) ? (
    <a {...props} href={href} />
  ) : (
    <NextLink {...props} href={href} />
  );
}
