export type TokenRef = `$${string}`;

export type ColorLit = `#${string}`;
export type DimensionLit = {
  value: number;
  unit: "px" | "rem";
};
export type DurationLit = {
  value: number;
  unit: "ms" | "s";
};

export type Color = {
  type: "color";
  value: ColorLit | TokenRef;
};
export type Dimension = {
  type: "dimension";
  value: DimensionLit | TokenRef;
};
export type Number = {
  type: "number";
  value: number | TokenRef;
};
export type Duration = {
  type: "duration";
  value: DurationLit | TokenRef;
};
/**
 * No `TokenRef` alternative: no token collection has an enum type, so an alias can
 * never resolve to one.
 */
export type Enum = {
  type: "enum";
  value: string;
};
export type CubicBezier = {
  type: "cubicBezier";
  value: readonly [number, number, number, number] | TokenRef;
};
export type ShadowLayer = {
  color: ColorLit | TokenRef;
  offsetX: DimensionLit;
  offsetY: DimensionLit;
  blur: DimensionLit;
  spread: DimensionLit;
};
export type Shadow = {
  type: "shadow";
  value: ShadowLayer[] | TokenRef;
};
export type GradientStop = {
  color: ColorLit | TokenRef;
  position: number;
};
export type Gradient = {
  type: "gradient";
  value: Array<GradientStop> | TokenRef;
};

export type Value = Color | Dimension | Number | Duration | Enum | CubicBezier | Shadow | Gradient;

export interface ComponentSpecModel {
  kind: "ComponentSpec";
  metadata: {
    id: string;
    name: string;
    [key: string]: string | number | boolean;
  };
  data: ComponentSpecData;
}

/**
 * Both keys are always present, unlike in authoring where either may be omitted:
 * a reader of the exchange document should never have to supply a default.
 */
export interface Rule {
  variants: Record<string, string>;
  states: string[];
  slots: {
    [slot: string]: {
      [property: string]: Value;
    };
  };
}

export interface ComponentSpecData {
  id: string;
  name: string;
  schema: ComponentSpecSchema;
  rules: Rule[];
}

export type ComponentSpecPropertySchema = Record<
  string,
  | {
      type: "color" | "dimension" | "number" | "duration" | "cubicBezier" | "shadow" | "gradient";
      values?: never;
      description?: string;
    }
  | { type: "enum"; values: string[]; description?: string }
>;

export interface ComponentSpecSlotSchema {
  [name: string]: {
    properties: ComponentSpecPropertySchema;
    description?: string;
  };
}

export interface ComponentSpecVariantSchema {
  [name: string]: {
    values: ComponentSpecVariantValueSchema;
    defaultValue?: string;
    description?: string;
  };
}

export interface ComponentSpecVariantValueSchema {
  [name: string]: {
    description?: string;
  };
}

/** Weakest state first; a state's position in this list is its precedence rank. */
export type ComponentSpecStateSchema = Array<{
  id: string;
  suppresses: string[];
  description?: string;
}>;

export interface ComponentSpecSchema {
  slots: ComponentSpecSlotSchema;
  variants: ComponentSpecVariantSchema;
  states: ComponentSpecStateSchema;
}

export interface TokensModel {
  kind: "Tokens";
  metadata: {
    id: string;
    name: string;
    [key: string]: string | number | boolean;
  };
  data: TokensData;
}

export interface TokensData {
  collection: string;
  tokens: {
    [tokenName: TokenRef]: {
      values: {
        [mode: string]: Value;
      };
      description?: string;
    };
  };
}

export interface TokenCollectionsModel {
  kind: "TokenCollections";
  metadata: {
    id: string;
    name: string;
    [key: string]: string | number | boolean;
  };
  data: Array<{
    name: string;
    modes: Array<{ id: string; description?: string }>;
  }>;
}

export type Model = ComponentSpecModel | TokensModel | TokenCollectionsModel;
