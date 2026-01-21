"use client";

import { AST } from "@seed-design/rootage-core";
import { useState } from "react";
import { TokenCell, TokenValue } from "./token-cell";
import { TokenLink } from "./token-link";

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
  const canExpand = values.length > 1;

  return (
    <tr
      key={id}
      className={`hover:bg-fd-muted ${canExpand ? (isExpanded ? "cursor-zoom-out" : "cursor-zoom-in") : ""}`}
      onClick={canExpand ? () => setIsExpanded((prev) => !prev) : undefined}
    >
      <td>
        <div className="flex flex-col gap-1">
          <TokenLink id={id} description={description} />
        </div>
      </td>
      <td className="align-middle">
        <TokenCell isExpanded={isExpanded} values={values} resolvedValue={resolvedValue} />
      </td>
    </tr>
  );
}
