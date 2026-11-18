import clsx from "clsx";
import { type ButtonHTMLAttributes, forwardRef } from "react";

/**
 * 문서 메뉴 trigger 버튼. 메뉴 module(`docs-menu.tsx`) 없이 import할 수 있게 따로 둔다(lazy 메뉴의 정적 버튼이 쓴다).
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
        "inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-r2 border-0 bg-bg-transparent-selected px-3.5 py-2 t4-medium text-fg-neutral transition-colors duration-color-transition hover:bg-bg-transparent-selected-pressed data-[open]:bg-bg-transparent-selected-pressed data-[state=open]:bg-bg-transparent-selected-pressed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:text-fg-neutral",
        className,
      )}
      {...props}
    />
  );
});
DocsMenuTriggerButton.displayName = "DocsMenuTriggerButton";
