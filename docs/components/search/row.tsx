"use client";

import { IconChevronRightSmallLine } from "@karrotmarket/react-monochrome-icon";
import { Fragment, type ReactNode } from "react";

/**
 * One row in the results card. The document results and the recent pages that stand in for
 * them take turns filling the same box, so they are measured and coloured the same way rather
 * than each bringing its own idea of what a row is.
 *
 * `wrap-anywhere` because a row prints whatever line the page held, and a regex or a shell
 * command carries no space for the line breaker to work with. Left unbroken, one such row is
 * wider than the box, and the box — scrollable on one axis — takes a horizontal scrollbar for
 * it, dragging every other row sideways.
 */
export const ROW_CLASS_NAME =
  "relative block w-full select-none rounded-lg px-2.5 py-2 text-start text-sm wrap-anywhere text-fg-neutral";

/** The row's own ground when it is the one the reader is on. */
export const ROW_ACTIVE_CLASS_NAME = "bg-bg-transparent-pressed";

/**
 * Where a row's page sits, printed over its title — the one line that says which part of the
 * docs it came from, rather than leaving the title to be recognised on its own.
 */
export function Breadcrumbs({ trail }: { trail: ReactNode[] }) {
  if (trail.length === 0) return null;

  return (
    <span className="mb-0.5 flex flex-wrap items-center text-xs text-fg-neutral-subtle">
      {trail.map((crumb, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: crumbs are positional, and the trail is rebuilt whenever the row changes
        <Fragment key={index}>
          {index > 0 ? <IconChevronRightSmallLine className="size-3 shrink-0" /> : null}
          {crumb}
        </Fragment>
      ))}
    </span>
  );
}
