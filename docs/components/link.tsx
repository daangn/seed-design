import FumadocsLink from "fumadocs-core/link";
import type { ComponentProps } from "react";
import { archivePaths } from "@/lib/docs-archive";

// archive 채널은 디렉터리 URL(`…/`)로 배포되어, 내부 경로에 trailing slash를 붙여야 리다이렉트 없이
// 열린다. Next.js에서는 `trailingSlash: true`가 모든 링크에 하던 일이라 두 컴포넌트가 함께 맡는다.

/**
 * `next/link` 자리에 쓰는 일반 링크. 넘겨받은 속성만 가진 `<a>`를 렌더링한다.
 * `RootProvider`의 `components.Link`로도 넘겨 fumadocs가 내부에서 그리는 링크에 같은 규칙을 적용한다.
 */
export function PageLink({
  href,
  prefetch: _prefetch,
  ...props
}: ComponentProps<"a"> & { prefetch?: boolean }) {
  return <a {...props} href={href && archivePaths.pageHref(href)} />;
}

/** fumadocs `Link`. 외부 주소면 새 탭으로 여는 속성(`target`·`rel`)을 스스로 붙인다. */
export function DocsLink({ href, ...props }: ComponentProps<typeof FumadocsLink>) {
  return <FumadocsLink {...props} href={href && archivePaths.pageHref(href)} />;
}
