"use client";

import { clsx } from "cn";
import { createMarkdownRenderer, type MarkdownProps } from "fumadocs-core/content/md";
import type { CalloutType } from "fumadocs-ui/components/callout";
import type { Root } from "hast";
import type { ReactNode } from "react";
import rehypeRaw from "rehype-raw";
import { EXIT, visit } from "unist-util-visit";

/**
 * Everything Markdown itself can turn into an element here. A row's content is the Markdown its
 * page was serialized to, and `structureStringify` (see app/source.tsx) leaves whitelisted MDX
 * components in it as raw JSX — so a tag outside this set names one of those components, and
 * goes to `MdxTagBadge` rather than being rendered as an element nobody styled.
 */
const MARKDOWN_TAGS = new Set([
  "a",
  "blockquote",
  "br",
  "code",
  "del",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "li",
  "mark",
  "ol",
  "p",
  "pre",
  "span",
  "strong",
  "ul",
]);

/**
 * Hand the components off under a tag name React won't try to render on its own. Fumadocs' own
 * search dialog does the same (`rehypeCustomElements`), except it asks the DOM which tags it
 * doesn't know — a question only a browser can answer.
 */
function rehypeMdxTag() {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (MARKDOWN_TAGS.has(node.tagName)) return;

      node.properties._tagName = node.tagName;
      node.tagName = "custom";
    });
  };
}

/**
 * Whether anything in the tree puts characters on screen. A `custom` element counts without
 * holding text of its own — `MdxTagBadge` draws it from the component's name and attributes,
 * which is all a self-closing `<FigmaImage alt="…" />` ever had.
 */
function hasRenderableContent(tree: Root) {
  let renderable = false;

  visit(tree, (node) => {
    if (
      (node.type === "text" && node.value.trim() !== "") ||
      (node.type === "element" && node.tagName === "custom")
    ) {
      renderable = true;
      return EXIT;
    }
  });

  return renderable;
}

/**
 * Markdown that spends every character on structure and leaves nothing to print: a table cell
 * holding `-` parses to an empty list, and `2015. 7. 16.` to three nested ones, each digit read
 * as the number that opens the next. A row is one line lifted out of a page rather than a
 * document, so where the parse consumes it whole the source text is the truer reading — and the
 * one the row showed before its content was Markdown at all.
 *
 * Runs after `rehypeMdxTag`, which is what turns a component into the `custom` element the check
 * above looks for.
 */
function rehypeSourceFallback() {
  // Typed structurally rather than as a `VFile`: `vfile` reaches us through remark rather than
  // as a dependency of our own.
  return (tree: Root, file: { value: unknown }) => {
    if (hasRenderableContent(tree)) return;

    tree.children = [{ type: "text", value: String(file.value) }];
  };
}

const { Markdown } = createMarkdownRenderer({
  // The search server wraps matched terms in `<mark>` and the index carries components as raw
  // JSX, so a row's Markdown is only whole once the HTML in it is parsed too.
  remarkRehypeOptions: { allowDangerousHtml: true },
  rehypePlugins: [rehypeRaw, rehypeMdxTag, rehypeSourceFallback],
});

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

function calloutBadge(type: string) {
  // `components/callout.tsx` already throws on a type Fumadocs doesn't know, and every indexed
  // page is rendered through it during the static export — so a value arriving here that isn't
  // one means that guard was bypassed, not that content is wrong.
  if (!isCalloutType(type)) throw new Error(`Unknown Callout type in the search index: ${type}`);

  return CALLOUT_BADGE[type];
}

/**
 * Names the block a result came from in the reader's terms rather than the component's, and
 * borrows that block's own colors — Do/Don't from the guideline images, Callout from the
 * Callout recipe's tones.
 *
 * Keyed in lowercase: the names arrive from an HTML parser, which has no capitals to keep.
 */
function tagBadge(name: string, type: string) {
  switch (name) {
    case "doimage":
      return { label: "Do", className: "bg-bg-positive-weak text-fg-positive-contrast" };
    case "dontimage":
      return { label: "Don’t", className: "bg-bg-critical-weak text-fg-critical-contrast" };
    case "callout":
      return calloutBadge(type || "info");
    case "figmaimage":
    case "img":
      return { label: "이미지", className: NEUTRAL_BADGE };
    case "file":
      return { label: "파일", className: NEUTRAL_BADGE };
    default:
      // Surfaces a component that got indexed without being given a badge here.
      return { label: name, className: NEUTRAL_BADGE };
  }
}

/** Attributes whose value isn't prose. Still indexed, so they keep matching — just not shown. */
const NON_CONTENT_ATTRIBUTES = ["href", "src", "id", "figmaid", "type"];

/**
 * A custom MDX component inside a row: a badge for the block it sits in, then its attribute
 * values and children at normal body size. Follows how fumadocs' own search dialog
 * (`SearchDialogListItem`'s `custom` renderer) marks up a tag it has no component for.
 */
function MdxTagBadge({
  _tagName = "",
  children,
  ...attributes
}: {
  _tagName?: string;
  children?: ReactNode;
  [attribute: string]: unknown;
}) {
  const { label, className } = tagBadge(_tagName, String(attributes.type ?? ""));
  const values = Object.entries(attributes)
    .filter(([name]) => !NON_CONTENT_ATTRIBUTES.includes(name))
    .map(([_, value]) => String(value))
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
      {values}
      {values && children ? " · " : null}
      {children}
    </>
  );
}

/**
 * A row is one line out of a document rather than a document, so the blocks Markdown opens are
 * flattened to what a `<span>` inside the row's anchor may legally hold — and a link in it is
 * dropped to text, the row itself being the thing that gets clicked.
 */
const MARKDOWN_COMPONENTS: NonNullable<MarkdownProps["components"]> = {
  a: ({ href: _href, ...props }) => <span {...props} />,
  p: (props) => <span {...props} className="block min-w-0" />,
  blockquote: (props) => <span {...props} className="block" />,
  pre: (props) => <span {...props} className="block" />,
  strong: (props) => <strong {...props} className="font-semibold" />,
  code: (props) => (
    <code
      {...props}
      className="rounded-sm bg-bg-neutral-weak-alpha px-1 py-px font-mono text-[0.9em]"
    />
  ),
  mark: (props) => (
    <mark {...props} className="bg-[var(--selection-bg)] text-[var(--selection-fg)]" />
  ),
};

const COMPONENTS = { ...MARKDOWN_COMPONENTS, custom: MdxTagBadge };

/**
 * Read a result row's content, which arrives as the Markdown the page was serialized to with
 * the matched terms wrapped in `<mark>`.
 */
export function ResultMarkdown({ children }: { children: string }) {
  return <Markdown components={COMPONENTS}>{children}</Markdown>;
}
