import "server-only";

import type { AST } from "@seed-design/rootage-core";
import { resolveToken } from "@seed-design/rootage-core";
import {
  getDefaultModes,
  gradientToCss,
  shadowToCss,
  stringifyValueLit,
} from "@/components/rootage";
import { getRootage } from "./rootage";
import type { TokenSearchEntry } from "./token-search";

/** The only mode that makes a token render differently under the docs' dark theme. */
const DARK_MODE = "theme-dark";

function paint(
  light: AST.ValueLit,
  dark: AST.ValueLit,
): Pick<TokenSearchEntry, "background" | "boxShadow"> {
  if (light.kind === "ColorHexLit" && dark.kind === "ColorHexLit")
    return { background: { light: light.value, dark: dark.value } };

  if (light.kind === "GradientLit" && dark.kind === "GradientLit")
    return { background: { light: gradientToCss(light), dark: gradientToCss(dark) } };

  if (light.kind === "ShadowLit" && dark.kind === "ShadowLit")
    return { boxShadow: { light: shadowToCss(light), dark: shadowToCss(dark) } };

  return {};
}

/**
 * Flatten every token into the shape the search dialog needs. Resolution happens here,
 * at build time, so the client gets literal values instead of an alias chain to walk.
 */
export async function buildTokenSearchIndex(): Promise<TokenSearchEntry[]> {
  const rootage = await getRootage();
  const defaultModes = getDefaultModes(rootage);

  return rootage.tokenIds
    .map((id) => {
      const { collection, description } = rootage.tokenEntities[id];
      const modes = rootage.tokenCollectionEntities[collection].modes;

      const resolveIn = (mode: string) =>
        resolveToken(rootage, id, { ...defaultModes, [collection]: mode }).value;

      const light = resolveIn(modes[0].id);
      const dark = modes.some((mode) => mode.id === DARK_MODE) ? resolveIn(DARK_MODE) : light;

      const lastDot = id.lastIndexOf(".");

      return {
        id,
        group: id.slice(0, lastDot),
        key: id.slice(lastDot + 1),
        kind: light.kind,
        label: stringifyValueLit(light),
        ...(description && { description }),
        ...paint(light, dark),
      } satisfies TokenSearchEntry;
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}
