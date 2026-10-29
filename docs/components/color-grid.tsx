import { resolveToken } from "@seed-design/rootage-core";
import { getRootage } from "@/lib/rootage";
import { ColorSwatch } from "./color-swatch";
import { getDefaultModes } from "./rootage";

export interface ColorGridProps {
  scales: {
    prefix: string;
    name: string;
  }[];
}

export async function ColorGrid(props: ColorGridProps) {
  const rootage = await getRootage();
  const defaultModes = getDefaultModes(rootage);
  const scales = props.scales;
  const rows = scales.map((scale) => {
    const tokens = rootage.tokenIds
      // `gray`가 `gray-alpha-*`까지 잡지 않도록 prefix 뒤에는 숫자 스텝만 허용한다.
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

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex gap-1 justify-center">
        <div className="flex-1" />
        {rows[0].tokens.map((token, i) => (
          <div key={i} className="flex-1 text-xs text-center text-fd-muted-foreground">
            {token.identifier.split("-").at(-1)}
          </div>
        ))}
      </div>
      {rows.map(({ name, tokens }) => (
        <div key={name} className="flex gap-1 items-center">
          <div className="flex-1 text-sm text-fd-muted-foreground">{name}</div>
          {tokens.map((token) => (
            <ColorSwatch
              key={token.identifier}
              identifier={token.identifier}
              lightValue={token.lightHex}
              darkValue={token.darkHex}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
