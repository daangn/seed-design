import type { ComponentProps } from "react";

type SiteLinkProps = Omit<ComponentProps<"a">, "href"> & { href: string };

// 사이트 안 이동은 plain `<a>`다. Astro ClientRouter가 같은 origin 링크를 가로챈다(Phase 2).
// 다른 빌드(latest ↔ archive)를 가리키는 절대 주소도 문서 이동으로 열린다.
export function SiteLink({ href, ...props }: SiteLinkProps) {
  return <a {...props} href={href} />;
}
