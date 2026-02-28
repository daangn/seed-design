"use client";

import Link from "next/link";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import type {
  Blockquote,
  Code,
  Content,
  Emphasis,
  Heading,
  HTML,
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
  ThematicBreak,
} from "mdast";
import { useMemo, type ReactNode } from "react";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

const markdownProcessor = unified().use(remarkParse).use(remarkGfm);

function toInternalSeedHref(url: string): string | null {
  try {
    const parsed = new URL(url);
    const isSeedDomain =
      parsed.hostname === "seed-design.io" || parsed.hostname === "www.seed-design.io";
    if (!isSeedDomain) return null;

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
}

function renderInlineNode(node: Content, key: string): ReactNode {
  switch (node.type) {
    case "text":
      return <span key={key}>{(node as Text).value}</span>;
    case "strong":
      return (
        <strong key={key}>
          {(node as Strong).children.map((child, i) => renderInlineNode(child, `${key}-${i}`))}
        </strong>
      );
    case "emphasis":
      return (
        <em key={key}>
          {(node as Emphasis).children.map((child, i) => renderInlineNode(child, `${key}-${i}`))}
        </em>
      );
    case "inlineCode":
      return <code key={key}>{(node as InlineCode).value}</code>;
    case "link": {
      const linkNode = node as MdLink;
      const internalHref = toInternalSeedHref(linkNode.url);
      const children = linkNode.children.map((child, i) => renderInlineNode(child, `${key}-${i}`));

      if (internalHref) {
        return (
          <Link key={key} href={internalHref} className="text-fd-primary hover:underline break-all">
            {children}
          </Link>
        );
      }

      return (
        <a
          key={key}
          href={linkNode.url}
          target="_blank"
          rel="noreferrer"
          className="text-fd-primary hover:underline break-all"
        >
          {children}
        </a>
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

  return (
    <td key={key} className={`px-2 py-1 align-top ${className}`}>
      {cell.children.map((child, i) => renderInlineNode(child, `${key}-${i}`))}
    </td>
  );
}

function renderBlockNode(node: Content, key: string): ReactNode {
  switch (node.type) {
    case "heading": {
      const headingNode = node as Heading;
      const content = headingNode.children.map((child, i) =>
        renderInlineNode(child, `${key}-${i}`),
      );

      if (headingNode.depth <= 2) return <h2 key={key}>{content}</h2>;
      if (headingNode.depth === 3) return <h3 key={key}>{content}</h3>;
      if (headingNode.depth === 4) return <h4 key={key}>{content}</h4>;
      return <h5 key={key}>{content}</h5>;
    }

    case "paragraph": {
      const paragraphNode = node as Paragraph;
      return (
        <p key={key}>
          {paragraphNode.children.map((child, i) => renderInlineNode(child, `${key}-${i}`))}
        </p>
      );
    }

    case "list": {
      const listNode = node as List;
      const Element = listNode.ordered ? "ol" : "ul";
      return (
        <Element key={key}>
          {listNode.children.map((child, i) => renderBlockNode(child, `${key}-${i}`))}
        </Element>
      );
    }

    case "listItem": {
      const listItem = node as ListItem;
      return (
        <li key={key}>
          {listItem.children.map((child, i) => renderBlockNode(child, `${key}-${i}`))}
        </li>
      );
    }

    case "blockquote": {
      const blockquote = node as Blockquote;
      return (
        <blockquote key={key}>
          {blockquote.children.map((child, i) => renderBlockNode(child, `${key}-${i}`))}
        </blockquote>
      );
    }

    case "thematicBreak":
      return <hr key={key} />;

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

    case "html":
      return <p key={key}>{(node as HTML).value}</p>;

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
      {root.children.map((node, i) => renderBlockNode(node, `chat-md-${i}`))}
    </div>
  );
}
