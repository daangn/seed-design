import clsx from "clsx";
import { type ButtonHTMLAttributes, forwardRef } from "react";

/**
 * 문서 메뉴 trigger 버튼. 메뉴 module(`docs-menu.tsx`) 없이 import할 수 있게 따로 둔다(lazy 메뉴의 정적 버튼이 쓴다).
 *
 * transition은 hover·열림으로 바뀌는 배경만 건다. 글자색은 테마로만 바뀌므로 transition하면 테마 전환 때 배경은 즉시
 * 바뀌는데 글자가 이전 테마 색으로 남아 잠깐 사라져 보인다.
 */
export const DocsMenuTriggerButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, type = "button", ...props }, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      className={clsx(
        "inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-r2 border-0 bg-bg-transparent-selected px-3.5 py-2 t4-medium text-fg-neutral transition-[background-color] duration-color-transition hover:bg-bg-transparent-selected-pressed data-[open]:bg-bg-transparent-selected-pressed data-[state=open]:bg-bg-transparent-selected-pressed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:text-fg-neutral",
        className,
      )}
      {...props}
    />
  );
});
DocsMenuTriggerButton.displayName = "DocsMenuTriggerButton";
