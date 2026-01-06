"use client";

import { AST } from "@seed-design/rootage-core";
import { useState } from "react";
import { TokenCell } from "./token-cell";
import { TokenLink } from "./token-link";

export interface TokenTableItem {
  id: string;
  values: string[];
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
  const { id, values, resolvedValue } = item;

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <tr
      key={id}
      className="hover:bg-fd-muted cursor-pointer"
      onClick={() => setIsExpanded((prev) => !prev)}
    >
      <td>
        <TokenLink id={id} />
      </td>
      <td className="align-middle">
        <TokenCell isExpanded={isExpanded} values={values} resolvedValue={resolvedValue} />
      </td>
    </tr>
  );
}
