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
// Copy of `HAPTIC_SYSTEM_PRESETS` in ../ast.ts; format types stay import-free.
export type HapticSystem = "select" | "lightFeedback" | "success" | "error";
export type Haptic = {
  type: "haptic";
  value: { sharpness: number; intensity: number } | { system: HapticSystem };
};

/**
 * A value from an `enum` property's list, written bare.
 *
 * Kept out of `Value`: being `string`, it would swallow the template-literal
 * members and stop them rejecting a malformed color or dimension. Only a
 * component spec property can hold one, so it joins at `PropertyValue` instead.
 */
export type Enum = string;

export type Value =
  | Color
  | Dimension
  | Number
  | Duration
  | CubicBezier
  | Shadow
  | Gradient
  | Haptic
  | TokenRef;

export type PropertyValue = Value | Enum;

export interface TokenCollectionsModel {
  kind: "TokenCollections";
  metadata: {
    id: string;
    name: string;
    [key: string]: string | number | boolean;
  };
  data: Array<{
    name: string;
    modes: Array<{ id: string; description?: string; minWidth?: number }>;
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
      [property: string]: PropertyValue;
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
      type:
        | "color"
        | "dimension"
        | "number"
        | "duration"
        | "cubicBezier"
        | "shadow"
        | "gradient"
        | "haptic";
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
