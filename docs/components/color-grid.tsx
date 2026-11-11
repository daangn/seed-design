import { ColorSwatch } from "./color-swatch";

export interface ColorGridProps {
  scales: {
    prefix: string;
    name: string;
  }[];
}

export interface ColorGridRow {
  name: string;
  tokens: { identifier: string; lightHex: string; darkHex: string }[];
}

export function ColorGrid({ rows }: { rows: ColorGridRow[] }) {
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
