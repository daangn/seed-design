import { AST, resolveToken, RootageCtx } from "@seed-design/rootage-core";
import { useMemo } from "react";
import { DescriptionButton } from "./description-button";
import { getDefaultModes, stringifyStates, stringifyTokenLit, stringifyValueLit } from "./rootage";
import { TableRoot } from "./table";
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
  const { rootage, variant, schema } = props;
  const tableItems: TableItem[] = useMemo(() => {
    const modes = getDefaultModes(rootage);

    return variant.body.flatMap((stateDecl) => {
      const stateKey = stringifyStates(stateDecl.states);
      return stateDecl.body.flatMap((slotDecl) => {
        const slotKey = slotDecl.slot;
        const slotSchema = schema.slots.find((s) => s.name === slotKey);

        return slotDecl.body.map((propertyDecl) => {
          const propertyKey = propertyDecl.property;
          const propertySchema = slotSchema?.properties.find((p) => p.name === propertyKey);

          if (propertyDecl.value.kind === "TokenLit") {
            const { path, value } = resolveToken(
              rootage,
              stringifyTokenLit(propertyDecl.value),
              modes,
            );

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
    });
  }, [rootage, variant, schema]);

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
      {/* 같은 슬롯·속성 행 강조는 `row-highlight` widget(`src/mdx/widgets.ts`)이 `data-hover-key`로 처리한다. */}
      <tbody data-widget="row-highlight">
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
            />
          );
        })}
      </tbody>
    </TableRoot>
  );
}

function ComponentVariantRow(props: {
  item: TableItem;
  shouldRenderState: boolean;
  shouldRenderSlot: boolean;
  shouldRenderProperty: boolean;
}) {
  const { item, shouldRenderState, shouldRenderSlot, shouldRenderProperty } = props;
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

  const canExpand = values.length > 1;

  return (
    // 펼침은 `expand` widget이 이 행의 `data-expanded`로 처리한다.
    <tr
      key={id}
      data-hover-key={`${slotKey}/${propertyKey}`}
      data-widget={canExpand ? "expand" : undefined}
      className={`group/expand data-highlighted:bg-bg-neutral-weak ${canExpand ? "cursor-zoom-in data-expanded:cursor-zoom-out" : ""}`}
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
        <TokenCell values={values} resolvedValue={resolvedValue} />
      </td>
    </tr>
  );
}
