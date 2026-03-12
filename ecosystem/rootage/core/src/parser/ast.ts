export type TokenRef = `$${string}`;

// Literal
export interface ColorHexLit {
  kind: "ColorHexLit";
  value: `#${string}`;
}

export interface DimensionLit {
  kind: "DimensionLit";
  value: number;
  unit: "px" | "rem";
}

export interface DurationLit {
  kind: "DurationLit";
  value: number;
  unit: "ms" | "s";
}

export interface NumberLit {
  kind: "NumberLit";
  value: number;
}

export interface CubicBezierLit {
  kind: "CubicBezierLit";
  value: readonly [number, number, number, number];
}

export interface ShadowLayerLit {
  kind: "ShadowLayerLit";
  color: ColorHexLit | TokenLit;
  offsetX: DimensionLit;
  offsetY: DimensionLit;
  blur: DimensionLit;
  spread: DimensionLit;
}

export interface ShadowLit {
  kind: "ShadowLit";
  layers: ShadowLayerLit[];
}

export interface GradientStopLit {
  kind: "GradientStopLit";
  color: ColorHexLit | TokenLit;
  position: NumberLit;
}

export interface GradientLit {
  kind: "GradientLit";
  stops: GradientStopLit[];
}

export type ValueLit =
  | ColorHexLit
  | DimensionLit
  | DurationLit
  | NumberLit
  | CubicBezierLit
  | ShadowLit
  | GradientLit;

export interface TokenLit {
  kind: "TokenLit";
  identifier: TokenRef;
  group: string[];
  key: string;
}

// Metadata
export interface MetadataDeclaration {
  kind: "MetadataDeclaration";
  fields: MetadataFieldDeclaration[];
}

export interface MetadataFieldDeclaration {
  kind: "MetadataFieldDeclaration";
  key: string;
  value: string | number | boolean;
}

// Tokens
export interface ColorTokenDeclaration {
  kind: "ColorTokenDeclaration";
  collection: string;
  token: TokenLit;
  values: ColorTokenValueDeclaration[];
  description?: string;
}

export interface ColorTokenValueDeclaration {
  kind: "ColorTokenValueDeclaration";
  mode: string;
  value: ColorHexLit | TokenLit;
}

export interface DimensionTokenDeclaration {
  kind: "DimensionTokenDeclaration";
  collection: string;
  token: TokenLit;
  values: DimensionTokenValueDeclaration[];
  description?: string;
}

export interface DimensionTokenValueDeclaration {
  kind: "DimensionTokenValueDeclaration";
  mode: string;
  value: DimensionLit | TokenLit;
}

export interface NumberTokenDeclaration {
  kind: "NumberTokenDeclaration";
  collection: string;
  token: TokenLit;
  values: NumberTokenValueDeclaration[];
  description?: string;
}

export interface NumberTokenValueDeclaration {
  kind: "NumberTokenValueDeclaration";
  mode: string;
  value: NumberLit | TokenLit;
}

export interface DurationTokenDeclaration {
  kind: "DurationTokenDeclaration";
  collection: string;
  token: TokenLit;
  values: DurationTokenValueDeclaration[];
  description?: string;
}

export interface DurationTokenValueDeclaration {
  kind: "DurationTokenValueDeclaration";
  mode: string;
  value: DurationLit | TokenLit;
}

export interface CubicBezierTokenDeclaration {
  kind: "CubicBezierTokenDeclaration";
  collection: string;
  token: TokenLit;
  values: CubicBezierTokenValueDeclaration[];
  description?: string;
}

export interface CubicBezierTokenValueDeclaration {
  kind: "CubicBezierTokenValueDeclaration";
  mode: string;
  value: CubicBezierLit | TokenLit;
}

export interface ShadowTokenDeclaration {
  kind: "ShadowTokenDeclaration";
  collection: string;
  token: TokenLit;
  values: ShadowTokenValueDeclaration[];
  description?: string;
}

export interface ShadowTokenValueDeclaration {
  kind: "ShadowTokenValueDeclaration";
  mode: string;
  value: ShadowLit | TokenLit;
}

export interface GradientTokenDeclaration {
  kind: "GradientTokenDeclaration";
  collection: string;
  token: TokenLit;
  values: GradientTokenValueDeclaration[];
  description?: string;
}

export interface GradientTokenValueDeclaration {
  kind: "GradientTokenValueDeclaration";
  mode: string;
  value: GradientLit | TokenLit;
}

// Used when a token references another token but the referenced token is unknown while parsing
// (e.g. when a token references a token that is defined later in the document or in another document)
export interface UnresolvedTokenDeclaration {
  kind: "UnresolvedTokenDeclaration";
  collection: string;
  token: TokenLit;
  values: UnresolvedTokenValueDeclaration[];
  description?: string;
}

export interface UnresolvedTokenValueDeclaration {
  kind: "UnresolvedTokenValueDeclaration";
  mode: string;
  value: TokenLit;
}

export type TokenDeclaration =
  | ColorTokenDeclaration
  | DimensionTokenDeclaration
  | NumberTokenDeclaration
  | DurationTokenDeclaration
  | CubicBezierTokenDeclaration
  | ShadowTokenDeclaration
  | GradientTokenDeclaration
  | UnresolvedTokenDeclaration;

export interface TokensDocument {
  kind: "TokensDocument";
  metadata: MetadataDeclaration;
  data: TokenDeclaration[];
}

// TokenCollections
export interface TokenCollectionDeclaration {
  kind: "TokenCollectionDeclaration";
  name: string;
  modes: string[];
}

export interface TokenCollectionsDocument {
  kind: "TokenCollectionsDocument";
  metadata: MetadataDeclaration;
  data: TokenCollectionDeclaration[];
}

// ComponentSpec
export interface ColorPropertyDeclaration {
  kind: "ColorPropertyDeclaration";
  property: string;
  value: ColorHexLit | TokenLit;
}

export interface DimensionPropertyDeclaration {
  kind: "DimensionPropertyDeclaration";
  property: string;
  value: DimensionLit | TokenLit;
}

export interface NumberPropertyDeclaration {
  kind: "NumberPropertyDeclaration";
  property: string;
  value: NumberLit | TokenLit;
}

export interface DurationPropertyDeclaration {
  kind: "DurationPropertyDeclaration";
  property: string;
  value: DurationLit | TokenLit;
}

export interface CubicBezierPropertyDeclaration {
  kind: "CubicBezierPropertyDeclaration";
  property: string;
  value: CubicBezierLit | TokenLit;
}

export interface ShadowPropertyDeclaration {
  kind: "ShadowPropertyDeclaration";
  property: string;
  value: ShadowLit | TokenLit;
}

export interface GradientPropertyDeclaration {
  kind: "GradientPropertyDeclaration";
  property: string;
  value: GradientLit | TokenLit;
}

export interface UnresolvedPropertyDeclaration {
  kind: "UnresolvedPropertyDeclaration";
  property: string;
  value: TokenLit;
}

export type PropertyDeclaration =
  | ColorPropertyDeclaration
  | DimensionPropertyDeclaration
  | NumberPropertyDeclaration
  | DurationPropertyDeclaration
  | CubicBezierPropertyDeclaration
  | ShadowPropertyDeclaration
  | GradientPropertyDeclaration
  | UnresolvedPropertyDeclaration;

export interface SlotDeclaration {
  kind: "SlotDeclaration";
  slot: string;
  body: PropertyDeclaration[];
}

export interface StateExpression {
  kind: "StateExpression";
  value: string;
}

export interface StateDeclaration {
  kind: "StateDeclaration";
  states: StateExpression[];
  body: SlotDeclaration[];
}

export interface VariantExpression {
  kind: "VariantExpression";
  name: string;
  value: string;
}

export interface VariantDeclaration {
  kind: "VariantDeclaration";
  variants: VariantExpression[];
  body: StateDeclaration[];
}

export interface SlotSchemaDeclaration {
  kind: "SlotSchemaDeclaration";
  name: string;
  properties: PropertySchemaDeclaration[];
  description?: string;
}

export interface PropertySchemaDeclaration {
  kind: "PropertySchemaDeclaration";
  name: string;
  type: "color" | "dimension" | "number" | "duration" | "cubicBezier" | "shadow" | "gradient";
  description?: string;
}

export interface VariantSchemaDeclaration {
  kind: "VariantSchemaDeclaration";
  name: string;
  values: VariantValueSchemaDeclaration[];
  defaultValue: string;
  description?: string;
}

export interface VariantValueSchemaDeclaration {
  kind: "VariantValueSchemaDeclaration";
  name: string;
  description?: string;
}

export interface SchemaDeclaration {
  kind: "SchemaDeclaration";
  slots: SlotSchemaDeclaration[];
  variants: VariantSchemaDeclaration[];
}

export interface ComponentSpecDeclaration {
  kind: "ComponentSpecDeclaration";
  id: string;
  name: string;
  schema: SchemaDeclaration;
  body: VariantDeclaration[];
}

export interface ComponentSpecDocument {
  kind: "ComponentSpecDocument";
  metadata: MetadataDeclaration;
  data: ComponentSpecDeclaration;
}

export type Node =
  | ColorHexLit
  | DimensionLit
  | DurationLit
  | NumberLit
  | CubicBezierLit
  | ShadowLayerLit
  | ShadowLit
  | GradientStopLit
  | GradientLit
  | TokenLit
  | MetadataDeclaration
  | MetadataFieldDeclaration
  | ColorTokenDeclaration
  | ColorTokenValueDeclaration
  | DimensionTokenDeclaration
  | DimensionTokenValueDeclaration
  | NumberTokenDeclaration
  | NumberTokenValueDeclaration
  | DurationTokenDeclaration
  | DurationTokenValueDeclaration
  | CubicBezierTokenDeclaration
  | CubicBezierTokenValueDeclaration
  | ShadowTokenDeclaration
  | ShadowTokenValueDeclaration
  | GradientTokenDeclaration
  | GradientTokenValueDeclaration
  | UnresolvedTokenDeclaration
  | UnresolvedTokenValueDeclaration
  | TokensDocument
  | TokenCollectionDeclaration
  | TokenCollectionsDocument
  | ColorPropertyDeclaration
  | DimensionPropertyDeclaration
  | NumberPropertyDeclaration
  | DurationPropertyDeclaration
  | CubicBezierPropertyDeclaration
  | ShadowPropertyDeclaration
  | GradientPropertyDeclaration
  | UnresolvedPropertyDeclaration
  | SlotDeclaration
  | StateExpression
  | StateDeclaration
  | VariantExpression
  | VariantDeclaration
  | ComponentSpecDeclaration
  | ComponentSpecDocument;
