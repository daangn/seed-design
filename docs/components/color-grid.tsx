import { resolveToken } from "@ride-developer/rootage-core";
import { getRootage } from "./rootage";
import { ColorSwatch } from "./color-swatch";

export interface ColorGridProps {
  scales: {
    prefix: string;
    name: string;
  }[];
}

export async function ColorGrid(props: ColorGridProps) {
  const rootage = await getRootage();
  const scales = props.scales;
  const rows = scales.map((scale) => {
    const tokens = rootage.tokenIds
      .filter((id) => id.startsWith(`$color.palette.${scale.prefix}`))
      .map((id) => {
        const { value: lightValue } = resolveToken(rootage, id, {
          global: "default",
          color: "theme-light",
        });
        const { value: darkValue } = resolveToken(rootage, id, {
          global: "default",
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
