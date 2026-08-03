export type TokenRef = `$${string}`;

export type Color = `#${string}`;
export type Dimension = `${number}px` | `${number}rem`;
export type Number = number;
export type Duration = `${number}${"ms" | "s"}`;
export type CubicBezier = {
  type: "cubicBezier";
  value: readonly [number, number, number, number];
};
export type ShadowLayer = {
  color: Color;
  offsetX: Dimension;
  offsetY: Dimension;
  blur: Dimension;
  spread: Dimension;
};
export type Shadow = {
  type: "shadow";
  value: ShadowLayer[];
};
export type GradientStop = {
  color: Color;
  position: Number;
};
export type Gradient = {
  type: "gradient";
  value: GradientStop[];
};

/**
 * A value from an `enum` property's list, written bare.
 *
 * Widening the union to `string` swallows the template-literal members above, so
 * this type no longer rejects a malformed colour or dimension. There is nothing
 * shape-based left to check once a type's values are arbitrary words; the parser
 * dispatches on the declared type and the analyzer checks list membership.
 */
export type Enum = string;

export type Value =
  | Color
  | Dimension
  | Number
  | Duration
  | Enum
  | CubicBezier
  | Shadow
  | Gradient
  | TokenRef;

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
      excludeFromExchange?: boolean;
    };
  };
}

export interface ComponentSpecModel {
  kind: "ComponentSpec";
  metadata: {
    id: string;
    name: string;
    [key: string]: string | number | boolean;
  };
  data: ComponentSpecData;
}

export interface ComponentSpecData {
  schema?: ComponentSpecSchema;
  definitions: ComponentSpecDefinitions;
}

export interface ComponentSpecVariantDefinitions {
  [state: string]: {
    [slot: string]: {
      [property: string]: Value;
    };
  };
}

export interface ComponentSpecDefinitions {
  [variantExpression: string]: ComponentSpecVariantDefinitions;
}

export interface ComponentSpecSlotSchema {
  [name: string]: {
    properties: ComponentSpecPropertySchema;
    description?: string;
  };
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

export interface ComponentSpecVariantSchema {
  [name: string]: {
    values: ComponentSpecVariantValueSchema;
    defaultValue: string;
    description?: string;
  };
}

export interface ComponentSpecVariantValueSchema {
  [name: string]: {
    description?: string;
  };
}

export interface ComponentSpecSchema {
  slots: ComponentSpecSlotSchema;
  /**
   * Optional because the parser infers the variant axes from the keys of
   * `definitions` and only merges this in on top — most component documents
   * declare nothing here.
   */
  variants?: ComponentSpecVariantSchema;
}

export type Model = TokenCollectionsModel | TokensModel | ComponentSpecModel;
