import type { LLMsOptions } from "fumadocs-core/mdx-plugins/remark-llms";
import type { PlaceholderData } from "fumadocs-core/mdx-plugins/remark-llms.runtime";
import type { MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx-jsx";

export type JsxNode = MdxJsxFlowElement | MdxJsxTextElement;

/**
 * Derived rather than imported: `mdast-util-to-markdown` is not a dependency here, it
 * only reaches us through fumadocs' own types. Taking them from the callback we actually
 * implement also keeps them correct if fumadocs changes the signature.
 */
type Stringify = NonNullable<LLMsOptions["stringify"]>;
export type State = Parameters<Stringify>[2];
export type Info = Parameters<Stringify>[3];

export interface RenderContext {
  /** Serialize the node's children as inline markdown. */
  phrasing: () => string;
  /** Serialize the node's children as block markdown. Inline nodes fall back to `phrasing`. */
  flow: () => string;
  /** Read a string-literal attribute. Expression attributes read as `undefined`. */
  attr: (name: string) => string | undefined;
  state: State;
  info: Info;
}

/**
 * A tag whose replacement cannot be computed while stringifying, because the data has to
 * be fetched or read asynchronously.
 *
 * `remarkLLMs` writes these out as `placeholder()` markers at compile time and
 * `renderPlaceholder` fills them in when a page is read, which is the only point in the
 * pipeline that can await. Everything else belongs in `LLMHandler` — going through a
 * placeholder costs a second pass over the whole document.
 */
export interface LLMPlaceholder {
  /** JSX tag names this placeholder owns. Two placeholders may not claim the same name. */
  names: string[];
  /**
   * Markdown to put in the marker's place.
   *
   * `null` restores the original tag. Unlike `LLMHandler.render` there is no node left to
   * fall back to by then, so the tag is rebuilt from the marker — same intent, worse
   * fidelity, which is why only the failure path should use it.
   */
  render: (data: PlaceholderData) => Promise<string | null> | string | null;
}

export interface LLMHandler {
  /** JSX tag names this handler owns. Two handlers may not claim the same name. */
  names: string[];
  /**
   * Whether to drop the node from the output.
   *
   * Deliberately separate from `render`: returning `""` there does not delete anything,
   * because `defaultStringifier` tests the return value for truthiness and falls through
   * to its default handling on a falsy one. Removal is marked in a pre-pass instead,
   * which is why this predicate only gets the node — no `state`, no serialized children.
   */
  remove?: (node: JsxNode) => boolean;
  /**
   * Markdown to put in the node's place.
   *
   * Returning `undefined` leaves the original JSX in the output. That is the failure
   * path: when the data a handler needs is missing, keeping the tag loses less than
   * dropping the content it wraps.
   */
  render?: (node: JsxNode, ctx: RenderContext) => string | undefined;
}
