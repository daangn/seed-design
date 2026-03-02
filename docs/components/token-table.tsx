"use client";

import { IconCheckmarkClipboardLine, IconCheckmarkFill } from "@karrotmarket/react-monochrome-icon";
import { AST } from "@seed-design/rootage-core";
import { useState } from "react";
import { TokenCell, TokenValue } from "./token-cell";
import { TokenLink } from "./token-link";

function toCssVar(tokenId: string): string {
  return `--seed-${tokenId.replace(/^\$/, "").replace(/\./g, "-")}`;
}

export interface TokenTableItem {
  id: string;
  description?: string;
  values: TokenValue[];
  resolvedValue: AST.ValueLit;
}

export interface TokenTableProps {
  items: TokenTableItem[];
}

export function TokenTable(props: TokenTableProps) {
  const { items } = props;

  return (
    <table>
      <thead>
        <tr>
          <th>이름</th>
          <th>값</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          return <TokenRow key={item.id} item={item} />;
        })}
      </tbody>
    </table>
  );
}

function TokenRow(props: { item: TokenTableItem }) {
  const { item } = props;
  const { id, description, values, resolvedValue } = item;

  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const canExpand = values.length > 1;

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(toCssVar(id)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <tr
      key={id}
      className={`group hover:bg-fd-muted ${canExpand ? (isExpanded ? "cursor-zoom-out" : "cursor-zoom-in") : ""}`}
      onClick={canExpand ? () => setIsExpanded((prev) => !prev) : undefined}
    >
      <td>
        <div className="flex items-start gap-2 content-center">
          <div className="flex flex-col gap-1 min-w-0">
            <TokenLink id={id} description={description} />
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="mt-0.5 flex-none opacity-0 group-hover:opacity-100 transition-opacity text-fd-muted-foreground hover:text-fd-foreground"
            title={`CSS 변수 복사: ${toCssVar(id)}`}
            aria-label={`${toCssVar(id)} 복사`}
          >
            {copied ? (
              <IconCheckmarkFill size={14} className="flex-none" />
            ) : (
              <IconCheckmarkClipboardLine size={14} />
            )}
          </button>
        </div>
      </td>
      <td className="align-middle">
        <TokenCell isExpanded={isExpanded} values={values} resolvedValue={resolvedValue} />
      </td>
    </tr>
  );
}
