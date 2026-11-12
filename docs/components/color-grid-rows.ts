import { resolveToken } from "@seed-design/rootage-core";
import { getRootage } from "@/lib/rootage";
import type { ColorGridProps, ColorGridRow } from "./color-grid";
import { getDefaultModes } from "./rootage";

/** 팔레트 scale별 토큰의 라이트·다크 값을 읽는다. */
export async function getColorGridRows(scales: ColorGridProps["scales"]): Promise<ColorGridRow[]> {
  const rootage = await getRootage();
  const defaultModes = getDefaultModes(rootage);

  return scales.map((scale) => {
    const tokens = rootage.tokenIds
      .filter((id) => new RegExp(`^\\$color\\.palette\\.${scale.prefix}-\\d+$`).test(id))
      .map((id) => {
        const { value: lightValue } = resolveToken(rootage, id, {
          ...defaultModes,
          color: "theme-light",
        });
        const { value: darkValue } = resolveToken(rootage, id, {
          ...defaultModes,
          color: "theme-dark",
        });
        return {
          identifier: id,
          lightHex: (lightValue as { kind: "ColorHexLit"; value: string }).value,
          darkHex: (darkValue as { kind: "ColorHexLit"; value: string }).value,
        };
      });

    return { name: scale.name, tokens };
  });
}
