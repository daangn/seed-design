import { getRootage } from "@/lib/rootage";
import { stringifyValueLit } from "@/components/rootage";
import { TokenValue } from "@/components/token-cell";
import {
  scaleColorMappings,
  semanticColorMappings,
  staticColorMappings,
} from "@seed-design/migration-index/color";
import { resolveToken, type AST } from "@seed-design/rootage-core";
import { ColorMigrationRow } from "./color-migration-row";

interface ColorMigrationIndexProps {
  prefix: "semantic" | "scale" | "static";
}

export interface TokenMappingItem {
  previousTokenId: string;
  newTokens: {
    id: string;
    values: TokenValue[];
    resolvedValue: AST.ValueLit;
  }[];
  description?: string;
}

export async function ColorMigrationIndex({ prefix }: ColorMigrationIndexProps) {
  const rootage = await getRootage();
  const mappings = {
    semantic: semanticColorMappings,
    scale: scaleColorMappings,
    static: staticColorMappings,
  }[prefix];

  const tableItems: TokenMappingItem[] = mappings.map((mapping) => ({
    previousTokenId: mapping.previous,
    newTokens: mapping.next.flatMap((newId) => {
      try {
        const { path, value } = resolveToken(rootage, newId as `$${string}`, {
          global: "default",
          color: "theme-light",
        });

        const valuesWithDescription: TokenValue[] = path.map((tokenRef) => ({
          ref: tokenRef,
          description: rootage.tokenEntities[tokenRef]?.description,
        }));
        valuesWithDescription.push({
          ref: stringifyValueLit(value),
          description: undefined,
        });

        return [
          {
            id: newId,
            values: valuesWithDescription,
            resolvedValue: value,
          },
        ];
      } catch {
        // Skip tokens that no longer exist in the current rootage (e.g.,
        // mappings that point to deprecated tokens).
        return [];
      }
    }),
    description: mapping.description,
  }));

  return (
    <table>
      <colgroup>
        <col />
        <col />
        <col style={{ width: "15%" }} />
      </colgroup>
      <thead>
        <tr>
          <th>이전</th>
          <th>SEED</th>
          <th>비고</th>
        </tr>
      </thead>
      <tbody>
        {tableItems.map((item) => (
          <ColorMigrationRow key={item.previousTokenId} item={item} />
        ))}
      </tbody>
    </table>
  );
}
