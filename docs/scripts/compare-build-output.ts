/**
 * 두 정적 빌드 산출물이 동등한지 3단계로 비교한다.
 *
 *   bun scripts/compare-build-output.ts <baselineDir> <candidateDir>
 *     [--only <경로 접두사>] [--max-diffs <n>] [--report <file.json>] [--html-diff-context <n>]
 *
 * 1단계: 파일 경로 목록, 2단계: 비HTML 파일 sha256, 3단계: HTML 정규화 DOM.
 * 허용하는 차이는 `compare-build-output.allowlist.ts`에서 관리한다.
 * 종료 코드: 허용 목록 밖 차이가 없으면 0, 있으면 1, 사용법 오류는 2.
 */
import { stat } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import {
  type AllowlistEntry,
  allowlist,
  type BuildFile,
  type FileEntry,
  type HtmlEntry,
  type PathEntry,
  type Side,
} from "./compare-build-output.allowlist";

const SIDES: Side[] = ["baseline", "candidate"];
const SIDE_LABEL: Record<Side, string> = { baseline: "기준", candidate: "후보" };
const CONCURRENCY = 8;

// ---------------------------------------------------------------------------
// HTML 정규화
// ---------------------------------------------------------------------------

interface ElementNode {
  kind: "element";
  tag: string;
  attrs: Map<string, string>;
  children: HtmlNode[];
  parent: ElementNode | undefined;
}
interface TextNode {
  kind: "text";
  value: string;
}
interface CommentNode {
  kind: "comment";
  value: string;
}
type HtmlNode = ElementNode | TextNode | CommentNode;

type Token =
  | { kind: "open"; tag: string; attrs: Map<string, string> }
  | { kind: "close"; tag: string }
  | { kind: "text"; value: string; preformatted: boolean }
  | { kind: "comment"; value: string };

export interface NormalizedHtml {
  /** 노드 하나가 한 줄인 정규화 직렬화. `[head]`·`[json-ld]` 줄은 정렬되어 순서가 의미 없다. */
  lines: string[];
  /** `$RC`·`$RS`로 제자리에 옮긴 React 스트리밍 세그먼트 수 */
  resolvedBoundaries: number;
  /** 옮길 세그먼트를 찾지 못해 fallback이 남은 경계·placeholder 수 */
  unresolvedBoundaries: number;
}

export interface NormalizeOptions {
  side: Side;
  path: string;
  rules?: HtmlEntry[];
  onRuleFired?: (id: string) => void;
}

const VOID_TAGS = new Set(
  "area base br col embed hr img input link meta source track wbr".split(" "),
);
const REMOVED_TAGS = new Set(["script", "style", "template", "next-route-announcer"]);
const UNWRAPPED_TAGS = new Set(["astro-island", "astro-slot", "astro-static-slot"]);
const REMOVED_LINK_RELS = new Set([
  "stylesheet",
  "preload",
  "modulepreload",
  "prefetch",
  "dns-prefetch",
]);
const HEAD_LINK_RELS = new Set([
  "canonical",
  "alternate",
  "describedby",
  "icon",
  "apple-touch-icon",
  "manifest",
]);
const HEAD_META_NAMES = /^(?:description|color-scheme|viewport|robots|referrer|twitter:.*)$/;
const HEAD_META_PROPERTIES = /^(?:og|article):/;
const BOOLEAN_ATTRS = new Set(
  "allowfullscreen async autofocus autoplay checked controls default defer disabled formnovalidate hidden inert ismap itemscope loop multiple muted nomodule novalidate open playsinline readonly required reversed selected".split(
    " ",
  ),
);
const URL_ATTRS = new Set(["src", "href", "srcset", "poster", "style"]);
const PREFORMATTED_TAGS = new Set(["pre", "textarea"]);

// React의 Suspense·텍스트 구분 마커(`$`, `/$`, `$?`, `$!`, `$~`, `&`, `/&`, 빈 주석)와 Astro의 `astro:end`다.
const FRAMEWORK_COMMENT = /^(?:\/?[$&]|\$[?!~]|\s*|astro:.*)$/;
const SUSPENSE_OPEN_COMMENT = /^(?:\$[?!~]?|&)$/;
const SUSPENSE_CLOSE_COMMENT = /^\/[$&]$/;

// React 19.2 서버 `useId`는 `_<identifierPrefix>R_<base32 tree id>[H<n>]_` 형태다(Next는 `_R_…_`, Astro island는 `_r11R_…_`).
// 이전 형식인 `:R…:`는 `tabs:React:…` 같은 실제 값과 구분할 수 없어 다루지 않는다.
const USE_ID = /(^|[^A-Za-z0-9])_[a-z0-9-]*R_[0-9a-v]*(?:H[0-9a-v]+)?_/g;

const BUNDLED_ASSET_URL = /[^\s"'(),]*\/(?:_next\/static|_astro)\/[^\s"'(),]*/g;
// Astro island는 `identifierPrefix` 때문에 `r30B:0`처럼 접두사가 붙는다.
const STREAMING_ID = /^[a-z0-9-]*[BSP]:[0-9a-f]+$/;
const STREAMING_SWAP = /\$R([CS])\("([a-z0-9-]*[BS]:[0-9a-f]+)","([a-z0-9-]*[SP]:[0-9a-f]+)"\)/g;

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(value: string): string {
  if (!value.includes("&")) return value;
  return value.replace(/&(?:#x([0-9a-f]+)|#(\d+)|([a-z]+));/gi, (match, hex, dec, name) => {
    if (hex) return String.fromCodePoint(Number.parseInt(hex, 16));
    if (dec) return String.fromCodePoint(Number.parseInt(dec, 10));
    return NAMED_ENTITIES[name] ?? match;
  });
}

// `\s`는 NBSP까지 접으므로 HTML의 ASCII 공백만 대상으로 한다.
function collapseWhitespace(value: string): string {
  return value.replace(/[ \t\n\r\f]+/g, " ");
}

function normalizeStyle(value: string): string {
  if (!/[ \t\n\r\f]/.test(value) && !value.endsWith(";")) return value;
  const declarations: string[] = [];
  let current = "";
  let quote = "";
  let depth = 0;
  for (const char of value) {
    if (quote) {
      if (char === quote) quote = "";
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth--;
    } else if (char === ";" && depth === 0) {
      declarations.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  declarations.push(current);
  return declarations
    .map((declaration) => {
      const colon = declaration.indexOf(":");
      if (colon < 0) return collapseWhitespace(declaration).trim();
      const property = declaration.slice(0, colon).trim();
      const propertyValue = collapseWhitespace(declaration.slice(colon + 1)).trim();
      return `${property}:${propertyValue}`;
    })
    .filter((declaration) => declaration !== "")
    .join(";");
}

function canonicalizeAssetUrls(value: string): string {
  if (!value.includes("/_next/static/") && !value.includes("/_astro/")) return value;
  return value.replace(BUNDLED_ASSET_URL, (url) => {
    const extension = /\.([a-z0-9]+)(?:[?#].*)?$/i.exec(url);
    return extension ? `«asset».${extension[1].toLowerCase()}` : "«asset»";
  });
}

function normalizeAttrs(attrs: Map<string, string>): Map<string, string> {
  const normalized = new Map<string, string>();
  for (const [name, rawValue] of attrs) {
    if (name.startsWith("data-astro-")) continue;
    let value = decodeEntities(rawValue);
    if (BOOLEAN_ATTRS.has(name) && !(name === "hidden" && value === "until-found")) value = "";
    else if (name === "class") value = collapseWhitespace(value).trim();
    else if (name === "style") value = normalizeStyle(value);
    if (URL_ATTRS.has(name)) value = canonicalizeAssetUrls(value);
    normalized.set(name, value);
  }
  return normalized;
}

function parseHtml(html: string): ElementNode {
  const root: ElementNode = {
    kind: "element",
    tag: "#document",
    attrs: new Map(),
    children: [],
    parent: undefined,
  };
  const stack: ElementNode[] = [root];
  let pendingText = "";

  const rewriter = new HTMLRewriter()
    .on("*", {
      element(element) {
        const parent = stack[stack.length - 1];
        const node: ElementNode = {
          kind: "element",
          tag: element.tagName.toLowerCase(),
          attrs: new Map(element.attributes),
          children: [],
          parent,
        };
        parent.children.push(node);
        if (!element.canHaveContent) return;
        stack.push(node);
        // 종료 태그가 생략된 요소는 조상의 종료 태그에서 handler가 호출되므로 이 노드까지 스택을 걷어낸다.
        element.onEndTag(() => {
          const index = stack.lastIndexOf(node);
          if (index > 0) stack.length = index;
        });
      },
    })
    .onDocument({
      text(chunk) {
        pendingText += chunk.text;
        if (!chunk.lastInTextNode) return;
        if (pendingText !== "") {
          stack[stack.length - 1].children.push({ kind: "text", value: pendingText });
        }
        pendingText = "";
      },
      comments(comment) {
        stack[stack.length - 1].children.push({ kind: "comment", value: comment.text });
      },
    });

  rewriter.transform(html);
  return root;
}

function textContent(node: ElementNode): string {
  let text = "";
  for (const child of node.children) {
    if (child.kind === "text") text += child.value;
    else if (child.kind === "element") text += textContent(child);
  }
  return text;
}

function collectElements(
  node: ElementNode,
  predicate: (el: ElementNode) => boolean,
  found: ElementNode[] = [],
): ElementNode[] {
  for (const child of node.children) {
    if (child.kind !== "element") continue;
    if (predicate(child)) found.push(child);
    collectElements(child, predicate, found);
  }
  return found;
}

/**
 * React가 out-of-order로 흘려보낸 세그먼트(`<div hidden id="S:n">`)를 인라인 스크립트가 하는 것처럼 제자리로 옮긴다.
 * - `$RC("B:n","S:n")`: 경계(`<!--$?--><template id="B:n">…<!--/$-->`)의 fallback을 세그먼트 내용으로 대체한다.
 * - `$RS("S:n","P:n")`: placeholder `<template id="P:n">`를 세그먼트 내용으로 대체한다.
 */
function resolveStreamingBoundaries(root: ElementNode): { resolved: number; unresolved: number } {
  const swaps: { kind: string; first: string; second: string }[] = [];
  for (const script of collectElements(root, (el) => el.tag === "script")) {
    for (const [, kind, first, second] of textContent(script).matchAll(STREAMING_SWAP)) {
      swaps.push({ kind, first, second });
    }
  }

  const isStreamingId = (el: ElementNode) => STREAMING_ID.test(el.attrs.get("id") ?? "");
  let resolved = 0;
  if (swaps.length > 0) {
    const byId = new Map<string, ElementNode>();
    for (const el of collectElements(root, isStreamingId)) byId.set(el.attrs.get("id") ?? "", el);

    // 스크립트는 문서 순서대로 실행되므로 같은 순서로 적용한다. 안쪽 세그먼트($RS)가 바깥 경계($RC)보다 먼저 온다.
    for (const swap of swaps) {
      const target = byId.get(swap.kind === "C" ? swap.first : swap.second);
      const segment = byId.get(swap.kind === "C" ? swap.second : swap.first);
      if (!target?.parent || !segment?.parent) continue;
      segment.parent.children.splice(segment.parent.children.indexOf(segment), 1);

      const siblings = target.parent.children;
      const start = siblings.indexOf(target);
      let end = start + 1;
      if (swap.kind === "C") {
        let depth = 0;
        for (; end < siblings.length; end++) {
          const sibling = siblings[end];
          if (sibling.kind !== "comment") continue;
          if (SUSPENSE_CLOSE_COMMENT.test(sibling.value)) {
            if (depth === 0) break;
            depth--;
          } else if (SUSPENSE_OPEN_COMMENT.test(sibling.value)) {
            depth++;
          }
        }
      }
      for (const child of segment.children) {
        if (child.kind === "element") child.parent = target.parent;
      }
      siblings.splice(start, end - start, ...segment.children);
      resolved++;
    }
  }

  const unresolved = collectElements(
    root,
    (el) => el.tag === "template" && isStreamingId(el),
  ).length;
  return { resolved, unresolved };
}

function isKeptHeadElement(el: ElementNode): boolean {
  if (el.tag === "title") return true;
  if (el.tag === "meta") {
    return (
      HEAD_META_NAMES.test(el.attrs.get("name") ?? "") ||
      HEAD_META_PROPERTIES.test(el.attrs.get("property") ?? "")
    );
  }
  if (el.tag === "link") {
    return relTokens(el).some((rel) => HEAD_LINK_RELS.has(rel));
  }
  return false;
}

function relTokens(el: ElementNode): string[] {
  return (el.attrs.get("rel") ?? "").toLowerCase().split(/\s+/).filter(Boolean);
}

function isJsonLdScript(el: ElementNode): boolean {
  return el.tag === "script" && el.attrs.get("type") === "application/ld+json";
}

function canonicalJson(text: string): string {
  try {
    return JSON.stringify(JSON.parse(text));
  } catch {
    return collapseWhitespace(text).trim();
  }
}

function serializeTokens(tokens: Token[]): string[] {
  // 주석·요소를 걷어낸 뒤에 인접하게 된 텍스트는 DOM에서 한 텍스트로 읽히므로 먼저 합친다.
  const merged: Token[] = [];
  for (const token of tokens) {
    const previous = merged[merged.length - 1];
    if (
      token.kind === "text" &&
      previous?.kind === "text" &&
      previous.preformatted === token.preformatted
    ) {
      previous.value += token.value;
    } else {
      merged.push(token);
    }
  }

  const ids = new Map<string, string>();
  const canonicalizeIds = (value: string) =>
    value.includes("R_")
      ? value.replace(USE_ID, (match, prefix: string) => {
          const id = match.slice(prefix.length);
          let placeholder = ids.get(id);
          if (!placeholder) {
            placeholder = `«id:${ids.size + 1}»`;
            ids.set(id, placeholder);
          }
          return prefix + placeholder;
        })
      : value;

  const lines: string[] = [];
  merged.forEach((token, index) => {
    if (token.kind === "open") {
      const attrs = [...token.attrs]
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([name, value]) => ` ${name}=${JSON.stringify(canonicalizeIds(value))}`);
      lines.push(`<${token.tag}${attrs.join("")}>`);
    } else if (token.kind === "close") {
      if (!VOID_TAGS.has(token.tag)) lines.push(`</${token.tag}>`);
    } else if (token.kind === "comment") {
      lines.push(`<!--${token.value}-->`);
    } else if (token.preformatted) {
      lines.push(JSON.stringify(token.value));
    } else {
      // 요소 경계에 붙은 공백은 소스 서식일 뿐이라 버리고, 형제 요소와 맞닿은 쪽의 단어 사이 공백은 한 칸으로 남긴다.
      let value = collapseWhitespace(token.value);
      if (merged[index - 1]?.kind !== "close") value = value.trimStart();
      if (merged[index + 1]?.kind !== "open") value = value.trimEnd();
      if (value.trim() !== "") lines.push(JSON.stringify(value));
    }
  });
  return lines;
}

export function normalizeHtml(html: string, options: NormalizeOptions): NormalizedHtml {
  const root = parseHtml(html);
  const boundaries = resolveStreamingBoundaries(root);
  const rules = (options.rules ?? []).filter(
    (rule) =>
      (!rule.side || rule.side === options.side) && (!rule.match || rule.match.test(options.path)),
  );

  const jsonLd: string[] = [];
  const headLines: string[] = [];
  const bodyTokens: Token[] = [];
  let htmlAttrs = new Map<string, string>();

  for (const script of collectElements(root, isJsonLdScript)) {
    jsonLd.push(canonicalJson(textContent(script)));
  }

  // parentTag는 unwrap되는 래퍼를 건너뛴, 정규화 결과 기준의 부모다.
  const emit = (
    node: HtmlNode,
    out: Token[],
    preformatted: boolean,
    parentTag: string | undefined,
  ): void => {
    if (node.kind === "text") {
      out.push({ kind: "text", value: decodeEntities(node.value), preformatted });
      return;
    }
    if (node.kind === "comment") {
      if (!FRAMEWORK_COMMENT.test(node.value)) out.push({ kind: "comment", value: node.value });
      return;
    }

    const { tag } = node;
    if (REMOVED_TAGS.has(tag)) return;
    if (tag === "link" && relTokens(node).some((rel) => REMOVED_LINK_RELS.has(rel))) return;

    const emitChildren = (childParentTag: string | undefined) => {
      const childPreformatted = preformatted || PREFORMATTED_TAGS.has(tag);
      for (const child of node.children) emit(child, out, childPreformatted, childParentTag);
    };

    if (UNWRAPPED_TAGS.has(tag)) {
      emitChildren(parentTag);
      return;
    }
    if (tag === "html") {
      htmlAttrs = normalizeAttrs(node.attrs);
      emitChildren(tag);
      return;
    }
    if (tag === "head") {
      // head 안의 태그는 순서가 의미 없으므로 요소 하나를 한 줄로 만들어 따로 모은다.
      for (const child of node.children) {
        if (child.kind !== "element" || !isKeptHeadElement(child)) continue;
        const tokens: Token[] = [];
        emit(child, tokens, false, tag);
        if (tokens.length > 0) headLines.push(`[head] ${serializeTokens(tokens).join(" ")}`);
      }
      return;
    }

    const start = out.length;
    const attrs = normalizeAttrs(node.attrs);
    out.push({ kind: "open", tag, attrs });
    emitChildren(tag);
    const onlyChild = out.length === start + 2 ? out[start + 1] : undefined;
    const element = {
      tag,
      attrs,
      parentTag,
      empty:
        out.length === start + 1 || (onlyChild?.kind === "text" && onlyChild.value.trim() === ""),
      side: options.side,
      path: options.path,
    };
    for (const rule of rules) {
      const action = rule.element(element);
      if (!action) continue;
      options.onRuleFired?.(rule.id);
      if (action === "remove") {
        out.length = start;
        return;
      }
      if (action === "unwrap") {
        out.splice(start, 1);
        return;
      }
    }
    out.push({ kind: "close", tag });
  };

  for (const child of root.children) emit(child, bodyTokens, false, undefined);

  const htmlLine = serializeTokens([{ kind: "open", tag: "html", attrs: htmlAttrs }]);
  return {
    lines: [
      ...htmlLine,
      ...headLines.sort(),
      ...jsonLd.sort().map((json) => `[json-ld] ${json}`),
      ...serializeTokens(bodyTokens),
    ],
    resolvedBoundaries: boundaries.resolved,
    unresolvedBoundaries: boundaries.unresolved,
  };
}

// ---------------------------------------------------------------------------
// 줄 단위 비교
// ---------------------------------------------------------------------------

const DIFF_WINDOW = 120;
const DIFF_OUTPUT_LINES = 30;
const LINE_WIDTH = 220;

function clip(line: string, from = 0): string {
  const start = from > 80 ? from - 60 : 0;
  const body = line.slice(start, start + LINE_WIDTH);
  return `${start > 0 ? "…" : ""}${body}${start + LINE_WIDTH < line.length ? "…" : ""}`;
}

function commonPrefixLength(a: string, b: string): number {
  let length = 0;
  while (length < a.length && length < b.length && a[length] === b[length]) length++;
  return length;
}

interface DiffOp {
  sign: " " | "-" | "+";
  line: string;
}

function lcsOps(a: string[], b: string[]): DiffOp[] {
  const lcs: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0),
  );
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const ops: DiffOp[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      ops.push({ sign: " ", line: a[i] });
      i++;
      j++;
    } else if (j >= b.length || (i < a.length && lcs[i + 1][j] >= lcs[i][j + 1])) {
      ops.push({ sign: "-", line: a[i++] });
    } else {
      ops.push({ sign: "+", line: b[j++] });
    }
  }
  return ops;
}

/**
 * 사람이 읽을 unified diff 앞부분을 만든다. 전체 LCS는 쪽당 수만 줄이라 비싸므로,
 * 갈라지는 지점마다 일정 구간만 LCS로 맞추고 다시 일치하는 줄에서 이어 간다.
 */
function renderDiff(baseline: string[], candidate: string[], context: number): string[] {
  const ops: (DiffOp & { a: number; b: number })[] = [];
  let i = 0;
  let j = 0;
  let changes = 0;
  while ((i < baseline.length || j < candidate.length) && changes < DIFF_OUTPUT_LINES) {
    if (i < baseline.length && j < candidate.length && baseline[i] === candidate[j]) {
      ops.push({ sign: " ", line: baseline[i], a: i++, b: j++ });
      continue;
    }
    const windowOps = lcsOps(
      baseline.slice(i, i + DIFF_WINDOW),
      candidate.slice(j, j + DIFF_WINDOW),
    );
    // 구간 끝의 줄은 짝이 구간 밖에 있을 수 있으므로 마지막으로 일치한 줄까지만 확정한다.
    const lastCommon = windowOps.findLastIndex((op) => op.sign === " ");
    for (const op of lastCommon < 0 ? windowOps : windowOps.slice(0, lastCommon + 1)) {
      ops.push({ ...op, a: i, b: j });
      if (op.sign !== "+") i++;
      if (op.sign !== "-") j++;
      if (op.sign !== " ") changes++;
    }
  }

  // 긴 줄이 한 글자만 다를 때 앞부분만 자르면 차이가 안 보이므로, 짝을 이루는 -/+ 줄은 갈라지는 위치 근처를 보여준다.
  const clipFrom = new Array<number>(ops.length).fill(0);
  const visible = new Array<boolean>(ops.length).fill(false);
  for (let index = 0; index < ops.length; index++) {
    if (ops[index].sign === " ") continue;
    let runEnd = index;
    while (runEnd < ops.length && ops[runEnd].sign !== " ") runEnd++;
    const removed: number[] = [];
    const added: number[] = [];
    for (let k = index; k < runEnd; k++) (ops[k].sign === "-" ? removed : added).push(k);
    for (let k = 0; k < Math.min(removed.length, added.length); k++) {
      const from = commonPrefixLength(ops[removed[k]].line, ops[added[k]].line);
      clipFrom[removed[k]] = from;
      clipFrom[added[k]] = from;
    }
    for (let k = Math.max(0, index - context); k < Math.min(ops.length, runEnd + context); k++) {
      visible[k] = true;
    }
    index = runEnd;
  }

  const output: string[] = [];
  for (let index = 0; index < ops.length && output.length < DIFF_OUTPUT_LINES; index++) {
    if (!visible[index]) continue;
    const op = ops[index];
    if (!visible[index - 1]) output.push(`@@ 기준 ${op.a + 1}번째 줄 / 후보 ${op.b + 1}번째 줄 @@`);
    output.push(`${op.sign} ${clip(op.line, clipFrom[index])}`);
  }
  return output;
}

function countLines(lines: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const line of lines) counts.set(line, (counts.get(line) ?? 0) + 1);
  return counts;
}

/** `from`에 `other`보다 더 많이 나오는 줄을 초과 횟수와 함께 돌려준다. */
function surplusLines(from: Map<string, number>, other: Map<string, number>): Map<string, number> {
  const surplus = new Map<string, number>();
  for (const [line, count] of from) {
    const extra = count - (other.get(line) ?? 0);
    if (extra > 0) surplus.set(line, extra);
  }
  return surplus;
}

function categorize(line: string): string {
  if (line.startsWith("<html")) return "html 속성";
  if (line.startsWith("[head]")) return "head";
  if (line.startsWith("[json-ld]")) return "JSON-LD";
  if (/^<h[1-6][ >]/.test(line)) return "heading";
  if (line.startsWith("<a ")) return "링크(a)";
  if (line.startsWith('"')) return "텍스트";
  return "body 요소";
}

// ---------------------------------------------------------------------------
// 단계별 비교
// ---------------------------------------------------------------------------

interface Options {
  baseline: string;
  candidate: string;
  only: string | undefined;
  maxDiffs: number;
  report: string | undefined;
  htmlDiffContext: number;
}

interface FileMismatch {
  path: string;
  baseline: { size: number; sha256: string };
  candidate: { size: number; sha256: string };
  /** 정규화 항목을 적용했는데도 달랐다면 그 항목 id */
  normalizedBy?: string;
  hint?: string;
}

interface HtmlDifference {
  path: string;
  categories: string[];
  onlyInBaseline: number;
  onlyInCandidate: number;
  diff: string[];
}

interface CommonDiffLine {
  side: Side;
  line: string;
  pages: number;
}

type FiredCounts = Map<string, Record<Side, number>>;

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

async function listFiles(dir: string, only: string | undefined): Promise<string[]> {
  const files: string[] = [];
  for await (const file of new Bun.Glob("**/*").scan({ cwd: dir, dot: true, onlyFiles: true })) {
    const posix = file.split(path.sep).join("/");
    if (!only || posix.startsWith(only)) files.push(posix);
  }
  return files.sort();
}

function sha256(bytes: Uint8Array): string {
  return new Bun.CryptoHasher("sha256").update(bytes).digest("hex");
}

const TEXT_EXTENSIONS = new Set(["", ".txt", ".json", ".xml", ".css", ".svg", ".webmanifest"]);

function firstTextDifference(file: string, a: Uint8Array, b: Uint8Array): string | undefined {
  if (!TEXT_EXTENSIONS.has(path.extname(file))) return undefined;
  const decoder = new TextDecoder();
  const aLines = decoder.decode(a).split("\n");
  const bLines = decoder.decode(b).split("\n");
  let line = 0;
  while (line < aLines.length && line < bLines.length && aLines[line] === bLines[line]) line++;
  const from = commonPrefixLength(aLines[line] ?? "", bLines[line] ?? "");
  return [
    `${line + 1}번째 줄부터 다름`,
    `- ${clip(aLines[line] ?? "(끝)", from)}`,
    `+ ${clip(bLines[line] ?? "(끝)", from)}`,
  ].join("\n");
}

async function compare(options: Options) {
  const fired: FiredCounts = new Map();
  const fire = (id: string, side: Side) => {
    const counts = fired.get(id) ?? { baseline: 0, candidate: 0 };
    counts[side]++;
    fired.set(id, counts);
  };
  const entriesOf = <S extends AllowlistEntry["stage"]>(stage: S) =>
    allowlist.filter(
      (entry): entry is Extract<AllowlistEntry, { stage: S }> => entry.stage === stage,
    );
  const pathEntries: PathEntry[] = entriesOf("path");
  const fileEntries: FileEntry[] = entriesOf("file");
  const htmlEntries: HtmlEntry[] = entriesOf("html");

  // 1단계: 파일 경로 목록
  const total: Record<Side, number> = { baseline: 0, candidate: 0 };
  const kept: Record<Side, Set<string>> = { baseline: new Set(), candidate: new Set() };
  for (const side of SIDES) {
    const dir = options[side];
    const files = await listFiles(dir, options.only);
    const fileSet = new Set(files);
    total[side] = files.length;
    const excludedBy = await mapLimit(files, CONCURRENCY * 4, async (file) => {
      const buildFile: BuildFile = {
        path: file,
        side,
        has: (other) => fileSet.has(other),
        head: (bytes) => Bun.file(path.join(dir, file)).slice(0, bytes).text(),
      };
      for (const entry of pathEntries) {
        if (entry.side && entry.side !== side) continue;
        const matched =
          entry.match instanceof RegExp ? entry.match.test(file) : await entry.match(buildFile);
        if (matched) return entry.id;
      }
      return undefined;
    });
    files.forEach((file, index) => {
      const id = excludedBy[index];
      if (id) fire(id, side);
      else kept[side].add(file);
    });
  }
  const onlyInBaseline = [...kept.baseline].filter((file) => !kept.candidate.has(file));
  const onlyInCandidate = [...kept.candidate].filter((file) => !kept.baseline.has(file));
  const common = [...kept.baseline].filter((file) => kept.candidate.has(file));

  // 2단계: 비HTML 파일 sha256
  const otherFiles = common.filter((file) => !file.endsWith(".html"));
  const fileResults = await mapLimit(
    otherFiles,
    CONCURRENCY,
    async (file): Promise<FileMismatch | undefined> => {
      const [a, b] = await Promise.all(
        SIDES.map((side) => Bun.file(path.join(options[side], file)).bytes()),
      );
      const hashes = [sha256(a), sha256(b)];
      if (hashes[0] === hashes[1]) return undefined;

      // 경로에 맞는 항목을 순서대로 모두 적용한다. 한 파일에 허용 사유가 둘 이상일 수 있다.
      const entries = fileEntries.filter((candidate) => candidate.match.test(file));
      const decoder = new TextDecoder();
      const normalize = (bytes: Uint8Array) =>
        entries.reduce((text, entry) => entry.normalize(text), decoder.decode(bytes));
      if (entries.length > 0 && normalize(a) === normalize(b)) {
        for (const entry of entries) for (const side of SIDES) fire(entry.id, side);
        return undefined;
      }
      return {
        path: file,
        baseline: { size: a.byteLength, sha256: hashes[0] },
        candidate: { size: b.byteLength, sha256: hashes[1] },
        normalizedBy: entries.map((entry) => entry.id).join(", ") || undefined,
        hint: firstTextDifference(file, a, b),
      };
    },
  );
  const fileMismatches = fileResults.filter(
    (result): result is FileMismatch => result !== undefined,
  );

  // 3단계: HTML 정규화 DOM
  const htmlFiles = common.filter((file) => file.endsWith(".html"));
  const boundaries: Record<Side, { resolved: number; unresolved: number }> = {
    baseline: { resolved: 0, unresolved: 0 },
    candidate: { resolved: 0, unresolved: 0 },
  };
  const commonLines = new Map<string, CommonDiffLine>();
  const noteCommonLines = (side: Side, lines: Map<string, number>) => {
    let noted = 0;
    for (const line of lines.keys()) {
      if (noted++ >= 200) break;
      const key = `${side}\n${line.slice(0, 200)}`;
      const entry = commonLines.get(key) ?? { side, line: line.slice(0, 200), pages: 0 };
      entry.pages++;
      commonLines.set(key, entry);
    }
  };

  const htmlResults = await mapLimit(
    htmlFiles,
    CONCURRENCY,
    async (file): Promise<HtmlDifference | undefined> => {
      const [a, b] = await Promise.all(
        SIDES.map(async (side) => {
          const html = await Bun.file(path.join(options[side], file)).text();
          const normalized = normalizeHtml(html, {
            side,
            path: file,
            rules: htmlEntries,
            onRuleFired: (id) => fire(id, side),
          });
          boundaries[side].resolved += normalized.resolvedBoundaries;
          boundaries[side].unresolved += normalized.unresolvedBoundaries;
          return normalized.lines;
        }),
      );
      if (a.length === b.length && a.every((line, index) => line === b[index])) return undefined;

      const aCounts = countLines(a);
      const bCounts = countLines(b);
      const onlyA = surplusLines(aCounts, bCounts);
      const onlyB = surplusLines(bCounts, aCounts);
      noteCommonLines("baseline", onlyA);
      noteCommonLines("candidate", onlyB);
      const categories = new Set([...onlyA.keys(), ...onlyB.keys()].map(categorize));
      if (categories.size === 0) categories.add("순서");
      const sum = (counts: Map<string, number>) =>
        [...counts.values()].reduce((totalCount, count) => totalCount + count, 0);
      return {
        path: file,
        categories: [...categories].sort(),
        onlyInBaseline: sum(onlyA),
        onlyInCandidate: sum(onlyB),
        diff: renderDiff(a, b, options.htmlDiffContext),
      };
    },
  );
  const htmlDifferences = htmlResults.filter(
    (result): result is HtmlDifference => result !== undefined,
  );

  const differences =
    onlyInBaseline.length + onlyInCandidate.length + fileMismatches.length + htmlDifferences.length;

  return {
    ok: differences === 0,
    differences,
    baseline: options.baseline,
    candidate: options.candidate,
    only: options.only,
    stage1: {
      total,
      compared: { baseline: kept.baseline.size, candidate: kept.candidate.size },
      onlyInBaseline,
      onlyInCandidate,
    },
    stage2: { compared: otherFiles.length, mismatches: fileMismatches },
    stage3: {
      compared: htmlFiles.length,
      differing: htmlDifferences,
      streamingBoundaries: boundaries,
      commonDiffLines: [...commonLines.values()]
        .filter((entry) => entry.pages > 1)
        .sort((x, y) => y.pages - x.pages)
        .slice(0, 100),
    },
    allowlist: allowlist.map((entry) => ({
      id: entry.id,
      stage: entry.stage,
      side: entry.side,
      reason: entry.reason,
      fired: fired.get(entry.id) ?? { baseline: 0, candidate: 0 },
    })),
  };
}

// ---------------------------------------------------------------------------
// 출력
// ---------------------------------------------------------------------------

function printSummary(result: Awaited<ReturnType<typeof compare>>, maxDiffs: number): void {
  const { stage1, stage2, stage3 } = result;
  const print = (line = "") => console.log(line);
  const printCapped = <T>(items: T[], render: (item: T) => string) => {
    for (const item of items.slice(0, maxDiffs)) print(render(item));
    if (items.length > maxDiffs) print(`  … 외 ${items.length - maxDiffs}건 (--max-diffs로 조절)`);
  };
  const indent = (text: string, prefix: string) =>
    text
      .split("\n")
      .map((line) => prefix + line)
      .join("\n");

  print("빌드 산출물 비교");
  print(`  기준: ${result.baseline} (파일 ${stage1.total.baseline}개)`);
  print(`  후보: ${result.candidate} (파일 ${stage1.total.candidate}개)`);
  if (result.only) print(`  범위: ${result.only}`);

  print();
  print("[1단계] 파일 경로 목록");
  print(
    `  허용 목록으로 제외한 뒤 비교 대상: 기준 ${stage1.compared.baseline}개 / 후보 ${stage1.compared.candidate}개`,
  );
  print(
    `  기준에만 있음 ${stage1.onlyInBaseline.length}개 / 후보에만 있음 ${stage1.onlyInCandidate.length}개`,
  );

  print();
  print("[2단계] 비HTML 파일 sha256");
  print(`  비교 ${stage2.compared}개 / 불일치 ${stage2.mismatches.length}개`);

  print();
  print("[3단계] HTML 정규화 DOM");
  print(`  비교 ${stage3.compared}쪽 / 차이 ${stage3.differing.length}쪽`);
  const byCategory = new Map<string, number>();
  for (const page of stage3.differing) {
    for (const category of page.categories) {
      byCategory.set(category, (byCategory.get(category) ?? 0) + 1);
    }
  }
  if (byCategory.size > 0) {
    const categories = [...byCategory].sort((a, b) => b[1] - a[1]);
    print(
      `  차이 분류(쪽 수): ${categories.map(([name, count]) => `${name} ${count}`).join(", ")}`,
    );
  }
  print(
    `  React 스트리밍 세그먼트($RC·$RS): ${SIDES.map(
      (side) =>
        `${SIDE_LABEL[side]} 해결 ${stage3.streamingBoundaries[side].resolved}개·미해결 ${stage3.streamingBoundaries[side].unresolved}개`,
    ).join(" / ")}`,
  );

  print();
  print("[허용 목록] 적용 횟수 (기준 / 후보)");
  for (const entry of result.allowlist) {
    const scope = entry.side ? `, ${SIDE_LABEL[entry.side]}만` : "";
    print(
      `  ${entry.id} (${entry.stage}${scope}): ${entry.fired.baseline} / ${entry.fired.candidate}`,
    );
    print(`      ${entry.reason}`);
  }

  if (stage1.onlyInBaseline.length > 0) {
    print();
    print(`[차이] 기준에만 있는 파일 ${stage1.onlyInBaseline.length}개`);
    printCapped(stage1.onlyInBaseline, (file) => `  - ${file}`);
  }
  if (stage1.onlyInCandidate.length > 0) {
    print();
    print(`[차이] 후보에만 있는 파일 ${stage1.onlyInCandidate.length}개`);
    printCapped(stage1.onlyInCandidate, (file) => `  + ${file}`);
  }
  if (stage2.mismatches.length > 0) {
    print();
    print(`[차이] sha256이 다른 파일 ${stage2.mismatches.length}개`);
    printCapped(stage2.mismatches, (mismatch) => {
      const lines = [
        `  ${mismatch.path}`,
        `      기준 ${mismatch.baseline.size}B ${mismatch.baseline.sha256.slice(0, 12)} / 후보 ${mismatch.candidate.size}B ${mismatch.candidate.sha256.slice(0, 12)}`,
      ];
      if (mismatch.normalizedBy) {
        lines.push(`      허용 목록 ${mismatch.normalizedBy}로 정규화해도 다름`);
      }
      if (mismatch.hint) lines.push(indent(mismatch.hint, "      "));
      return lines.join("\n");
    });
  }
  if (stage3.commonDiffLines.length > 0) {
    print();
    print("[차이] 여러 쪽에 공통으로 나타나는 정규화 줄 (- 기준에만, + 후보에만)");
    printCapped(
      stage3.commonDiffLines,
      (entry) =>
        `  ${String(entry.pages).padStart(4)}쪽 ${entry.side === "baseline" ? "-" : "+"} ${clip(entry.line)}`,
    );
  }
  if (stage3.differing.length > 0) {
    print();
    print(`[차이] 정규화 DOM이 다른 HTML ${stage3.differing.length}쪽`);
    printCapped(stage3.differing, (page) =>
      [
        `  ${page.path} — ${page.categories.join(", ")} (기준에만 ${page.onlyInBaseline}줄 / 후보에만 ${page.onlyInCandidate}줄)`,
        indent(page.diff.join("\n"), "      "),
      ].join("\n"),
    );
  }

  print();
  print(
    result.ok
      ? "결과: 통과 — 허용 목록 밖 차이 없음"
      : `결과: 실패 — 허용 목록 밖 차이 ${result.differences}건`,
  );
}

function usage(message: string): never {
  console.error(message);
  console.error(
    "사용법: bun scripts/compare-build-output.ts <baselineDir> <candidateDir> [--only <경로 접두사>] [--max-diffs <n>] [--report <file.json>] [--html-diff-context <n>]",
  );
  process.exit(2);
}

function parseCount(name: string, value: string): number {
  const count = Number(value);
  if (!Number.isInteger(count) || count < 0)
    usage(`--${name}에는 0 이상의 정수를 넘긴다: ${value}`);
  return count;
}

function parseCli(argv: string[]) {
  return parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      only: { type: "string" },
      "max-diffs": { type: "string", default: "20" },
      report: { type: "string" },
      "html-diff-context": { type: "string", default: "3" },
    },
  });
}

async function parseOptions(argv: string[]): Promise<Options> {
  let parsed: ReturnType<typeof parseCli>;
  try {
    parsed = parseCli(argv);
  } catch (error) {
    usage(error instanceof Error ? error.message : String(error));
  }
  const { positionals, values } = parsed;
  if (positionals.length !== 2) usage("기준 디렉터리와 후보 디렉터리를 하나씩 넘긴다.");
  for (const dir of positionals) {
    const stats = await stat(dir).catch(() => undefined);
    if (!stats?.isDirectory()) usage(`디렉터리를 찾을 수 없다: ${dir}`);
  }
  return {
    baseline: positionals[0],
    candidate: positionals[1],
    only: values.only?.replace(/^\/+/, ""),
    maxDiffs: parseCount("max-diffs", values["max-diffs"]),
    report: values.report,
    htmlDiffContext: parseCount("html-diff-context", values["html-diff-context"]),
  };
}

if (import.meta.main) {
  const options = await parseOptions(process.argv.slice(2));
  const result = await compare(options);
  printSummary(result, options.maxDiffs);
  if (options.report) {
    await Bun.write(options.report, `${JSON.stringify(result, null, 2)}\n`);
    console.log(`리포트: ${options.report}`);
  }
  process.exit(result.ok ? 0 : 1);
}
