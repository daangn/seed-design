/**
 * 페이지 메뉴 island(LLMS.txt 링크 복사·내용 복사·열기). `DocsArticle.astro`가 `client:idle`로 렌더링한다. changelog
 * 문서는 같은 메뉴를 viewer가 쓴다.
 *
 * 서버 HTML과 hydrate는 정적 버튼 하나다. 메뉴·snackbar(`PageActionsMenu.tsx`, SEED Menu·floating-ui)는 사용자가 버튼에
 * 다가가면 미리 받고 누르면 바꿔 그린다(`components/use-menu-intent.ts`). 메뉴는 열린 채로 시작한다.
 */
import { IconChevronDownLine } from "@karrotmarket/react-monochrome-icon";
import clsx from "clsx";
import { type ButtonHTMLAttributes, forwardRef, lazy, Suspense } from "react";
import { DocsMenuTriggerButton } from "@/components/docs-menu-trigger-button";
import { useMenuIntent } from "@/components/use-menu-intent";

const loadMenu = () => import("./PageActionsMenu");
const PageActionsMenu = lazy(loadMenu);

/** LLMS.txt 버튼. 정적 버튼과 메뉴 trigger(`asChild`)가 같은 마크업을 쓴다. */
export const PageActionsButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { open: boolean }
>(({ open, ...props }, ref) => (
  <DocsMenuTriggerButton ref={ref} {...props}>
    LLMS.txt
    <IconChevronDownLine className={clsx("transition-transform", open && "rotate-180")} />
  </DocsMenuTriggerButton>
));
PageActionsButton.displayName = "PageActionsButton";

export function PageActions({
  /** A URL to the raw Markdown/MDX content of page */
  markdownUrl,
}: {
  markdownUrl: string;
}) {
  const intent = useMenuIntent("click", loadMenu);
  const trigger = (
    <PageActionsButton
      open={false}
      aria-haspopup="menu"
      aria-expanded="false"
      {...intent.triggerProps}
    />
  );
  if (!intent.requested) return trigger;
  return (
    <Suspense fallback={trigger}>
      <PageActionsMenu markdownUrl={markdownUrl} defaultOpen={intent.clicked} />
    </Suspense>
  );
}
