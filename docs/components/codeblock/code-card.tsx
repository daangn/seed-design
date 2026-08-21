/**
 * Shared, side-effect-free card primitives for the SEED code block (Figma "Codeblock").
 * Kept in a directive-free module so both the server card (`code-block.tsx`) and the
 * client shells (`code-tabs.tsx`, `seed-code-block-auto.tsx`) can import them without
 * dragging server-only code (`fumadocs-core/highlight`) into the client bundle.
 *
 * The `shiki` class reuses Fumadocs' built-in syntax color CSS (scoped to `.shiki`), so
 * highlighted `<pre>` markup keeps its github-light/dark colors.
 */

/**
 * Transparent surface (shows the page background — white in light, #171717 in dark),
 * `radius/r3`, 1px `stroke-neutral-muted` border. Distinguished from the page by the
 * border only, matching the tables and demo card.
 */
export const codeCardClassName =
  "shiki seed-codeblock not-prose my-4 flex flex-col overflow-hidden rounded-r3 border border-solid border-stroke-neutral-muted";

/** Header row: chips / title on the left, copy button on the right. */
export const codeCardHeaderClassName = "flex items-center gap-x2 px-x5 pt-x3_5 pb-x3";

/** Scrollable code viewport. */
export const codeViewportClassName =
  "seed-codeblock__viewport fd-scroll-container overflow-auto py-x3 text-[0.875rem] leading-[1.375rem] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-stroke-focus-ring";

/** Horizontal divider between the header row and the code, inset like the Figma spec. */
export function CodeCardDivider() {
  return <div className="mx-x5 h-px shrink-0 bg-stroke-neutral-muted" />;
}
