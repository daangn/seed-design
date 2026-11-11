import { resolveToken } from "@seed-design/rootage-core";
import { getRootage } from "@/lib/rootage";
import { getDefaultModes, stringifyValueLit } from "./rootage";
import type { TokenValue } from "./token-cell";
import type { TokenTableItem } from "./token-table";

export interface TokenReferenceProps {
  groups?: string[];
  regex?: RegExp;
}

/** `<TokenReference>`가 보여 줄 토큰 행. `src/components/mdx/TokenReference.astro`가 island에 넘긴다. */
export async function getTokenReferenceItems(props: TokenReferenceProps) {
  const rootage = await getRootage();
  const groups = props.groups ?? [];
  const modes = getDefaultModes(rootage);
  const { regex } = props;

  const filterFn = regex
    ? (id: string) => regex.test(id)
    : (id: string) => id.startsWith(`$${groups.join(".")}`);

  return rootage.tokenIds.filter(filterFn).map((tokenId): TokenTableItem => {
    const { path, value } = resolveToken(rootage, tokenId, modes);

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
}
