"use client";

import clsx from "clsx";
import type { CalloutType } from "fumadocs-ui/components/callout";
import type { SearchItemType } from "fumadocs-ui/components/dialog/search";
import { useSearchList } from "fumadocs-ui/components/dialog/search";
import { type ReactNode, type Ref, useEffect, useRef } from "react";
import { ListButtonItem, ListLinkItem } from "seed-design/ui/list";
import { sectionLabel } from "@/lib/docs-sections";
import { decodeCharacterReferences, type MdxTag, parseMdxTag } from "./mdx-tag";

/**
 * fumadocs wraps the matched query terms in `<mark>…</mark>` inside the result content
 * string. Render those as highlighted chunks — reusing the global ::selection lime via the
 * `--selection-*` vars — and leave everything else as plain text.
 */
function renderContent(content: ReactNode): ReactNode {
  if (typeof content !== "string") return content;
  // split() with a capture group interleaves plain text with the matched terms:
  // [plain, match, plain, match, …] — odd indices are the highlighted terms.
  return content.split(/<mark>(.*?)<\/mark>/g).map((chunk, i) =>
    i % 2 === 1 ? (
      <mark key={`${i}-${chunk}`} className="bg-[var(--selection-bg)] text-[var(--selection-fg)]">
        {decodeCharacterReferences(chunk)}
      </mark>
    ) : (
      decodeCharacterReferences(chunk)
    ),
  );
}

/** Props whose value isn't prose. Still indexed, so they keep matching — just not shown. */
const NON_CONTENT_ATTRIBUTES = ["href", "src", "id", "figmaId", "type"];

/**
 * SEED Badge's `tone=neutral` pairing. The alpha fill rather than plain `bg-neutral-weak`:
 * a row lightens under hover/keyboard focus, and an opaque fill stays put — dropping the
 * badge's contrast against its own row to ~1.04, with no hue left to tell them apart.
 */
const NEUTRAL_BADGE = "bg-bg-neutral-weak-alpha text-fg-neutral-muted";

/**
 * One badge per Fumadocs callout type, mirroring the SEED tone `components/callout.tsx` maps
 * each one to. Keyed off the upstream union, so a type added there breaks this table.
 */
const CALLOUT_BADGE = {
  info: { label: "안내", className: "bg-bg-informative-weak text-fg-informative-contrast" },
  warn: { label: "주의", className: "bg-bg-warning-weak text-fg-warning-contrast" },
  warning: { label: "주의", className: "bg-bg-warning-weak text-fg-warning-contrast" },
  error: { label: "경고", className: "bg-bg-critical-weak text-fg-critical-contrast" },
  success: { label: "확인", className: "bg-bg-positive-weak text-fg-positive-contrast" },
  idea: { label: "팁", className: NEUTRAL_BADGE },
} as const satisfies Record<CalloutType, { label: string; className: string }>;

const isCalloutType = (value: string): value is CalloutType => value in CALLOUT_BADGE;

function calloutBadge(attributes: MdxTag["attributes"]) {
  // The index carries plain strings. `components/callout.tsx` already throws on a type Fumadocs
  // doesn't know, and every indexed page is rendered through it during the static export — so a
  // value arriving here that isn't one means that guard was bypassed, not that content is wrong.
  const type = attributes.find(({ name }) => name === "type")?.value ?? "info";
  if (!isCalloutType(type)) throw new Error(`Unknown Callout type in the search index: ${type}`);

  return CALLOUT_BADGE[type];
}

/**
 * Names the block a result came from in the reader's terms rather than the component's, and
 * borrows that block's own colors — Do/Don't from the guideline images, Callout from the
 * Callout recipe's tones.
 */
function tagBadge({ name, attributes }: MdxTag) {
  switch (name) {
    case "DoImage":
      return { label: "Do", className: "bg-bg-positive-weak text-fg-positive-contrast" };
    case "DontImage":
      return { label: "Don’t", className: "bg-bg-critical-weak text-fg-critical-contrast" };
    case "Callout":
      return calloutBadge(attributes);
    case "FigmaImage":
    case "img":
      return { label: "이미지", className: NEUTRAL_BADGE };
    case "File":
      return { label: "파일", className: NEUTRAL_BADGE };
    default:
      // Surfaces a component that got indexed without being given a badge here.
      return { label: name, className: NEUTRAL_BADGE };
  }
}

/**
 * Title for a result that came from a custom MDX component: a badge for the block it sits in,
 * then its attribute values and children at normal body size. Follows how fumadocs' own search
 * dialog (`SearchDialogListItem`'s `custom` renderer) marks up unknown tags.
 */
function MdxTagTitle({ tag }: { tag: MdxTag }) {
  const { label, className } = tagBadge(tag);
  const body = [
    ...tag.attributes
      .filter(({ name }) => !NON_CONTENT_ATTRIBUTES.includes(name))
      .map(({ value }) => value),
    tag.children,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <span
        className={clsx(
          "me-1.5 rounded-md px-1.5 py-0.5 align-[0.1em] text-xs font-medium",
          className,
        )}
      >
        {label}
      </span>
      {renderContent(body)}
    </>
  );
}

/**
 * Indent for the rows matched inside a document, measured from the row's own gutter so the
 * List Item recipe stays the single source for the outer padding. Inline rather than a
 * utility class because that recipe is unlayered and would win over `@layer utilities`.
 */
const NESTED_ROW_STYLE = {
  paddingInlineStart:
    "calc(var(--seed-dimension-spacing-x-global-gutter) + var(--seed-dimension-x4))",
};

/** Gap that opens a new block. Every row that isn't indented under a header starts one. */
const BLOCK_START_CLASS_NAME = "[&:not(:first-child)]:mt-2";

/**
 * A single search result rendered with the SEED List snippet (`ListLinkItem`). Wired to
 * fumadocs' `useSearchList()`: the keyboard-active row gets List Item's own neutral
 * hover/pressed background via `data-hover` (no brand `highlighted` variant) and scrolls
 * into view. Pass this via SearchDialogList's `Item` prop.
 *
 * Advanced search hands the list one `page` row per matched document followed by the rows
 * that matched inside it, so a `page` row renders as the group's header — the document title,
 * and the section it sits in — and the rest render indented beneath the header they belong to.
 */
export function SearchResultItem({
  item,
  onClick,
  showSection,
  nested,
}: {
  item: SearchItemType;
  onClick: () => void;

  /** Section label on group headers. Off under a filter, where it would repeat the chip. */
  showSection: boolean;

  /** Whether a header row above owns this one. Decided by the caller, which knows which
   * headers a component card replaced. */
  nested: boolean;
}) {
  const { active, setActive } = useSearchList();
  const isActive = item.id === active;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isActive) ref.current?.scrollIntoView({ block: "nearest" });
  }, [isActive]);

  // Drive List Item's built-in hover styling for the keyboard-active row (desktop uses
  // [data-hover], touch uses [data-active]). No brand highlight.
  const activation = {
    "aria-selected": isActive,
    "data-hover": isActive ? "" : undefined,
    "data-active": isActive ? "" : undefined,
    onPointerMove: () => setActive(item.id),
  };

  if (item.type === "action") {
    return (
      <ListButtonItem
        ref={ref as Ref<HTMLButtonElement>}
        title={item.node}
        onClick={onClick}
        {...activation}
      />
    );
  }

  const isHeader = item.type === "page";
  // Custom MDX components survive into the index as raw JSX (see app/source.tsx). Only the
  // rows matched inside a document can carry one — a header's content is the document title.
  const tag = !isHeader && typeof item.content === "string" ? parseMdxTag(item.content) : null;
  const title = tag ? <MdxTagTitle tag={tag} /> : renderContent(item.content);

  return (
    <ListLinkItem
      ref={ref as Ref<HTMLAnchorElement>}
      href={item.url}
      title={isHeader ? <span className="font-medium">{title}</span> : title}
      // The static advanced index has no breadcrumbs, so derive the section from the URL.
      suffix={isHeader && showSection ? sectionLabel(item.url) || undefined : undefined}
      // Indented rows belong to the header above them; everything else — a header, or a row
      // whose header a card replaced — starts a block of its own.
      rootProps={nested ? { style: NESTED_ROW_STYLE } : { className: BLOCK_START_CLASS_NAME }}
      onClick={(e) => {
        // Route through fumadocs' onSelect (client-side push + close). Keep href for
        // semantics and cmd/ctrl-click to open in a new tab.
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        onClick();
      }}
      {...activation}
    />
  );
}
