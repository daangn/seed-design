"use client";

import { AST, resolveToken, RootageCtx } from "@seed-design/rootage-core";
import { useMemo, useState } from "react";
import { DescriptionButton } from "./description-button";
import { stringifyStates, stringifyTokenLit, stringifyValueLit } from "./rootage-utils";
import { TokenCell, TokenValue } from "./token-cell";

interface ComponentVariantTableProps {
  rootage: RootageCtx;
  variant: AST.VariantDeclaration;
  schema: AST.SchemaDeclaration;
}

interface TableItem {
  id: string;
  stateKey: string;
  slotKey: string;
  propertyKey: string;
  slotDescription?: string;
  propertyDescription?: string;
  values: TokenValue[];
  resolvedValue: AST.ValueLit;
}

export function ComponentVariantTable(props: ComponentVariantTableProps) {
  const [hoveredRow, setHoveredRow] = useState<{
    slotKey: string;
    propertyKey: string;
  } | null>(null);

  const { rootage, variant, schema } = props;
  const tableItems: TableItem[] = useMemo(
    () =>
      variant.body.flatMap((stateDecl) => {
        const stateKey = stringifyStates(stateDecl.states);
        return stateDecl.body.flatMap((slotDecl) => {
          const slotKey = slotDecl.slot;
          const slotSchema = schema.slots.find((s) => s.name === slotKey);

          return slotDecl.body.map((propertyDecl) => {
            const propertyKey = propertyDecl.property;
            const propertySchema = slotSchema?.properties.find((p) => p.name === propertyKey);

            if (propertyDecl.value.kind === "TokenLit") {
              const { path, value } = resolveToken(rootage, stringifyTokenLit(propertyDecl.value), {
                global: "default",
                color: "theme-light",
              });

              // Collect descriptions for each token in the resolve chain
              const valuesWithDescription: TokenValue[] = path.map((tokenRef) => ({
                ref: tokenRef,
                description: rootage.tokenEntities[tokenRef]?.description,
              }));
              // Add final resolved value
              valuesWithDescription.push({
                ref: stringifyValueLit(value),
                description: undefined,
              });

              return {
                id: `${stateKey}/${slotKey}/${propertyKey}`,
                stateKey,
                slotKey,
                propertyKey,
                slotDescription: slotSchema?.description,
                propertyDescription: propertySchema?.description,
                values: valuesWithDescription,
                resolvedValue: value,
              };
            }

            return {
              id: `${stateKey}/${slotKey}/${propertyKey}`,
              stateKey,
              slotKey,
              propertyKey,
              slotDescription: slotSchema?.description,
              propertyDescription: propertySchema?.description,
              values: [{ ref: stringifyValueLit(propertyDecl.value), description: undefined }],
              resolvedValue: propertyDecl.value,
            };
          });
        });
      }),
    [rootage, variant, schema],
  );

  return (
    <div className="overflow-x-auto max-w-screen -mx-4 px-4 md:mx-0 md:px-0 my-[2em] [scrollbar-width:thin]">
      <table style={{ marginBlock: 0 }}>
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
                  hoveredRow?.slotKey === item.slotKey &&
                  hoveredRow?.propertyKey === item.propertyKey
                }
                onHoverStart={setHoveredRow}
                onHoverEnd={() => setHoveredRow(null)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ComponentVariantRow(props: {
  item: TableItem;
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
      className={`${isHighlighted ? "bg-fd-muted" : ""} ${canExpand ? (isExpanded ? "cursor-zoom-out" : "cursor-zoom-in") : ""}`}
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
