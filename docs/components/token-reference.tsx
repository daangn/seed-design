import { resolveToken } from "@seed-design/rootage-core";
import { getRootage } from "@/lib/rootage";
import { stringifyValueLit } from "./rootage";
import { TokenValue } from "./token-cell";
import { TokenTable, TokenTableItem } from "./token-table";

interface TokenReferenceProps {
  groups?: string[];
  regex?: RegExp;
}

export async function TokenReference(props: TokenReferenceProps) {
  const rootage = await getRootage();
  const groups = props.groups ?? [];

  const filterFn = props.regex
    ? (id: string) => props.regex!.test(id)
    : (id: string) => id.startsWith(`$${groups.join(".")}`);

  const tableItems: TokenTableItem[] = rootage.tokenIds.filter(filterFn).map((tokenId) => {
    const { path, value } = resolveToken(rootage, tokenId, {
      global: "default",
      color: "theme-light",
    });

    const valuesWithDescription: TokenValue[] = path.slice(1).map((tokenRef) => ({
      ref: tokenRef,
      description: rootage.tokenEntities[tokenRef]?.description,
    }));
    valuesWithDescription.push({
      ref: stringifyValueLit(value),
      description: undefined,
    });

    return {
      id: tokenId,
      description: rootage.tokenEntities[tokenId]?.description,
      values: valuesWithDescription,
      resolvedValue: value,
    };
  });

  return <TokenTable items={tableItems} />;
}
