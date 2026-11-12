"use client";

import type { AST } from "@seed-design/rootage-core";
import { useState } from "react";
import { DescriptionButton } from "./description-button";
import { TableRoot } from "./table";
import { TokenCell, type TokenValue } from "./token-cell";

export interface ComponentVariantTableItem {
  id: string;
  stateKey: string;
  slotKey: string;
  propertyKey: string;
  slotDescription?: string;
  propertyDescription?: string;
  values: TokenValue[];
  resolvedValue: AST.ValueLit;
}

interface ComponentVariantTableProps {
  /** `getComponentVariantTableItems()`가 서버에서 계산한 행. */
  items: ComponentVariantTableItem[];
}

export function ComponentVariantTable({ items: tableItems }: ComponentVariantTableProps) {
  const [hoveredRow, setHoveredRow] = useState<{
    slotKey: string;
    propertyKey: string;
  } | null>(null);

  return (
    <TableRoot wrapperClassName="max-w-screen -mx-4 px-4 md:mx-0 md:px-0 [scrollbar-width:thin]">
      <colgroup>
        <col style={{ width: "15%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "15%" }} />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th>상태</th>
          <th>슬롯</th>
          <th>속성</th>
          <th>값</th>
        </tr>
      </thead>
      <tbody>
        {tableItems.map((item, index) => {
          const prevItem = tableItems[index - 1];
          const shouldRenderState = item.stateKey !== prevItem?.stateKey;
          const shouldRenderSlot = shouldRenderState || item.slotKey !== prevItem?.slotKey;
          const shouldRenderProperty =
            shouldRenderSlot || item.propertyKey !== prevItem?.propertyKey;
          return (
            <ComponentVariantRow
              key={item.id}
              item={item}
              shouldRenderState={shouldRenderState}
              shouldRenderSlot={shouldRenderSlot}
              shouldRenderProperty={shouldRenderProperty}
              isHighlighted={
                hoveredRow?.slotKey === item.slotKey && hoveredRow?.propertyKey === item.propertyKey
              }
              onHoverStart={setHoveredRow}
              onHoverEnd={() => setHoveredRow(null)}
            />
          );
        })}
      </tbody>
    </TableRoot>
  );
}

function ComponentVariantRow(props: {
  item: ComponentVariantTableItem;
  shouldRenderState: boolean;
  shouldRenderSlot: boolean;
  shouldRenderProperty: boolean;
  isHighlighted: boolean;
  onHoverStart: (details: { slotKey: string; propertyKey: string }) => void;
  onHoverEnd: () => void;
}) {
  const {
    item,
    shouldRenderState,
    shouldRenderSlot,
    shouldRenderProperty,
    isHighlighted,
    onHoverStart,
    onHoverEnd,
  } = props;
  const {
    id,
    stateKey,
    slotKey,
    propertyKey,
    slotDescription,
    propertyDescription,
    values,
    resolvedValue,
  } = item;

  const [isExpanded, setIsExpanded] = useState(false);
  const canExpand = values.length > 1;

  return (
    <tr
      className={`${isHighlighted ? "bg-bg-neutral-weak" : ""} ${canExpand ? (isExpanded ? "cursor-zoom-out" : "cursor-zoom-in") : ""}`}
      key={id}
      onMouseEnter={() => onHoverStart({ slotKey, propertyKey })}
      onMouseLeave={() => onHoverEnd()}
      onClick={canExpand ? () => setIsExpanded((prev) => !prev) : undefined}
    >
      <td>{shouldRenderState ? stateKey : null}</td>
      <td>
        {shouldRenderSlot && (
          <span className="inline-flex items-center gap-1">
            {slotKey}
            {slotDescription && <DescriptionButton description={slotDescription} />}
          </span>
        )}
      </td>
      <td>
        {shouldRenderProperty && (
          <span className="inline-flex items-center gap-1">
            {propertyKey}
            {propertyDescription && <DescriptionButton description={propertyDescription} />}
          </span>
        )}
      </td>
      <td className="align-middle">
        <TokenCell isExpanded={isExpanded} values={values} resolvedValue={resolvedValue} />
      </td>
    </tr>
  );
}
