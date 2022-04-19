const knownColorGroupNames = ['white', 'gray', 'carrot', 'yellow', 'green', 'red', 'blue'] as const;
export type KnownColorGroup = typeof knownColorGroupNames[number];
export function isKnownColorGroup(str: string): str is KnownColorGroup {
  return knownColorGroupNames.includes(str as KnownColorGroup);
}

type MakeTokenSet<TGroup extends KnownColorGroup, TLightness extends number[]> = `$${TGroup}${TLightness[number]}`;
export type ColorToken = (
  | '$white'
  | MakeTokenSet<'gray', [100, 200, 300, 400, 500, 600, 700, 900]>
  | MakeTokenSet<'carrot', [50, 100, 200, 300, 400, 500, 600]>
  | MakeTokenSet<'yellow', [50, 500, 800]>
  | MakeTokenSet<'green', [50, 500, 800]>
  | MakeTokenSet<'red', [50, 800]>
  | MakeTokenSet<'blue', [50, 800]>
);

export type ColorScheme = Record<ColorToken, string>;

export type SemanticColorScheme = {
  background: ColorToken | string,
  backgroundLow: ColorToken | string,
};

export type SemanticColorKey = keyof SemanticColorScheme;

export type ColorTheme = {
  /**
   * Raw color tokens
   */
  scheme: ColorScheme,

  /**
   * Sematic color object (isn't eagerly populated)
   */
  semanticScheme: SemanticColorScheme,
};
