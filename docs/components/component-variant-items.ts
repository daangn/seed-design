import { type AST, resolveToken, type RootageCtx } from "@seed-design/rootage-core";
import type { ComponentVariantTableItem } from "./component-variant-table";
import { getDefaultModes, stringifyStates, stringifyTokenLit, stringifyValueLit } from "./rootage";
import type { TokenValue } from "./token-cell";

/** variant 선언을 상태·슬롯·속성 행으로 펼치고 토큰 참조 경로를 풀어 둔다. */
export function getComponentVariantTableItems(
  rootage: RootageCtx,
  variant: AST.VariantDeclaration,
  schema: AST.SchemaDeclaration,
): ComponentVariantTableItem[] {
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
}
