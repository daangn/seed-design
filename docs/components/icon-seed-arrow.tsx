import { clsx } from "cn";
import type { SVGProps } from "react";

/** SEED brand arrow glyph (from the landing "더보기" cursor). Filled, follows
 *  currentColor. internal → (default); external ↗ (rotated -45°, same glyph).
 *  Size and color come from `className` (e.g. "size-4 text-fd-muted-foreground").
 *  Extra SVG props (e.g. `data-*`, `style`) are forwarded to the `<svg>`. */
const SEED_ARROW_PATH =
  "M11.5,3l-1.79,1.79,4.46,4.46c.55.55.16,1.49-.62,1.49H3.5v2.53h10.05c.78,0,1.16.94.62,1.49l-4.46,4.46,1.79,1.79,9-9L11.5,3Z";

export function IconSeedArrow({
  external = false,
  className,
  ...props
}: SVGProps<SVGSVGElement> & { external?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
      className={clsx("shrink-0", external && "-rotate-45", className)}
    >
      <path d={SEED_ARROW_PATH} />
    </svg>
  );
}
