"use client";

import { sharedMdxComponents } from "@/components/mdx-shared-components";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import type {
  Blockquote,
  Code,
  Content,
  Emphasis,
  Heading,
  InlineCode,
  Link as MdLink,
  List,
  ListItem,
  Paragraph,
  Root,
  Strong,
  Table,
  TableCell,
  TableRow,
  Text,
} from "mdast";
import { createElement, Fragment, useMemo, type ElementType, type ReactNode } from "react";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

const markdownProcessor = unified().use(remarkParse).use(remarkGfm);

type HtmlTag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "strong"
  | "em"
  | "code"
  | "a"
  | "ol"
  | "ul"
  | "li"
  | "blockquote"
  | "hr"
  | "td";

function renderTag(
  tag: HtmlTag,
  props: Record<string, unknown>,
  key: string,
  children?: ReactNode,
) {
  const component = (sharedMdxComponents as Record<string, ElementType | undefined>)[tag] ?? tag;
  return createElement(component, { ...props, key }, children);
}

function renderInlineNode(node: Content, key: string): ReactNode {
  switch (node.type) {
    case "text":
      return (node as Text).value;
    case "strong":
      return renderTag(
        "strong",
        {},
        key,
        (node as Strong).children.map((child, i) => renderInlineNode(child, `${key}-${i}`)),
      );
    case "emphasis":
      return renderTag(
        "em",
        {},
        key,
        (node as Emphasis).children.map((child, i) => renderInlineNode(child, `${key}-${i}`)),
      );
    case "inlineCode":
      return renderTag("code", {}, key, (node as InlineCode).value);
    case "link": {
      const linkNode = node as MdLink;
      return renderTag(
        "a",
        { href: linkNode.url },
        key,
        linkNode.children.map((child, i) => renderInlineNode(child, `${key}-${i}`)),
      );
    }
    case "break":
      return <br key={key} />;
    default:
      return null;
  }
}

function renderTableCell(cell: TableCell, key: string, align?: "left" | "right" | "center" | null) {
  const className =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

  return renderTag(
    "td",
    { className: `px-2 py-1 align-top ${className}` },
    key,
    cell.children.map((child, i) => renderInlineNode(child, `${key}-${i}`)),
  );
}

function renderBlockNode(node: Content, key: string): ReactNode {
  switch (node.type) {
    case "heading": {
      const headingNode = node as Heading;
      const tagName = `h${Math.min(headingNode.depth, 6)}` as HtmlTag;
      return renderTag(
        tagName,
        {},
        key,
        headingNode.children.map((child, i) => renderInlineNode(child, `${key}-${i}`)),
      );
    }
    case "paragraph": {
      const paragraphNode = node as Paragraph;
      return renderTag(
        "p",
        {},
        key,
        paragraphNode.children.map((child, i) => renderInlineNode(child, `${key}-${i}`)),
      );
    }
    case "list": {
      const listNode = node as List;
      const tagName = listNode.ordered ? "ol" : "ul";
      return renderTag(
        tagName,
        {},
        key,
        listNode.children.map((child, i) => renderBlockNode(child, `${key}-${i}`)),
      );
    }
    case "listItem": {
      const listItem = node as ListItem;
      return renderTag(
        "li",
        {},
        key,
        listItem.children.map((child, i) => renderBlockNode(child, `${key}-${i}`)),
      );
    }
    case "blockquote": {
      const blockquote = node as Blockquote;
      return renderTag(
        "blockquote",
        {},
        key,
        blockquote.children.map((child, i) => renderBlockNode(child, `${key}-${i}`)),
      );
    }
    case "thematicBreak":
      return renderTag("hr", {}, key);
    case "code": {
      const codeNode = node as Code;
      return (
        <div key={key} className="my-2">
          <DynamicCodeBlock lang={codeNode.lang ?? "tsx"} code={codeNode.value} />
        </div>
      );
    }
    case "table": {
      const tableNode = node as Table;
      const [head, ...body] = tableNode.children as TableRow[];

      return (
        <div key={key} className="my-2 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            {head ? (
              <thead>
                <tr>
                  {head.children.map((cell, i) => (
                    <th
                      key={`${key}-head-${i}`}
                      className={`px-2 py-1 border-b border-fd-border text-left ${
                        tableNode.align?.[i] === "right"
                          ? "text-right"
                          : tableNode.align?.[i] === "center"
                            ? "text-center"
                            : "text-left"
                      }`}
                    >
                      {cell.children.map((child, j) =>
                        renderInlineNode(child, `${key}-head-${i}-${j}`),
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody>
              {body.map((row, rowIndex) => (
                <tr key={`${key}-row-${rowIndex}`}>
                  {row.children.map((cell, cellIndex) =>
                    renderTableCell(
                      cell,
                      `${key}-row-${rowIndex}-cell-${cellIndex}`,
                      tableNode.align?.[cellIndex],
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    default:
      return null;
  }
}

function parseMarkdown(markdown: string): Root | null {
  try {
    return markdownProcessor.parse(markdown) as Root;
  } catch {
    return null;
  }
}

export function ChatMarkdown({ markdown }: { markdown: string }) {
  const root = useMemo(() => parseMarkdown(markdown), [markdown]);

  if (!root) {
    return <div className="whitespace-pre-wrap break-words">{markdown}</div>;
  }

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      {root.children.map((node, i) => (
        <Fragment key={`chat-md-${i}`}>{renderBlockNode(node, `chat-md-${i}`)}</Fragment>
      ))}
    </div>
  );
}
