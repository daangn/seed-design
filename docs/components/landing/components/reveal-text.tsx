import { type ElementType, Fragment } from "react";

interface RevealTextProps {
  /** Wrapper tag (e.g. "h2", "h3", "p"). Defaults to "p". */
  as?: ElementType;
  /** Copy. Split on `\n` into rows, then on spaces into one masked word each. */
  text: string;
  /** Typography classes for the wrapper (font, size, color, line-height). */
  className?: string;
}

/**
 * Word-by-word reveal markup. Each `\n`-split line is a block row; within it every
 * space-split word sits in an `inline-block overflow-hidden` mask whose inner
 * `[data-reveal-word]` a scene (lib/scenes) lifts up + fades in (power3.out, small
 * stagger) as its section enters. A normal space *between* masks (outside the
 * overflow clip) preserves word spacing and keeps lines wrapping — Korean breaks
 * per 어절. Render-only: words are visible by default, so no-JS / reduced-motion
 * shows the text as-is — the scene hides them with `gsap.set` only when motion runs.
 */
export function RevealText({ as: Tag = "p", text, className }: RevealTextProps) {
  const lines = text.split("\n");
  return (
    <Tag className={className}>
      {lines.map((line, li) => {
        const words = line.split(" ");
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: lines come from a static split and never reorder.
          <Fragment key={li}>
            <span className="block">
              {words.map((word, wi) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: words come from a static split and never reorder.
                <Fragment key={wi}>
                  <span className="inline-block overflow-hidden align-bottom">
                    <span data-reveal-word className="inline-block will-change-transform">
                      {/* Non-breaking space keeps empty lines from collapsing the mask. */}
                      {word || " "}
                    </span>
                  </span>
                  {/* Real space between masks: word gap + a line-wrap opportunity. */}
                  {wi < words.length - 1 ? " " : null}
                </Fragment>
              ))}
            </span>
            {li < lines.length - 1 ? "\n" : null}
          </Fragment>
        );
      })}
    </Tag>
  );
}
