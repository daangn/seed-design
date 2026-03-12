import type {
  ColorHexLit,
  DimensionLit,
  DurationLit,
  NumberLit,
  CubicBezierLit,
  ShadowLayerLit,
  ShadowLit,
  GradientStopLit,
  GradientLit,
  TokenLit,
  ColorPropertyDeclaration,
  DimensionPropertyDeclaration,
  NumberPropertyDeclaration,
  DurationPropertyDeclaration,
  CubicBezierPropertyDeclaration,
  ShadowPropertyDeclaration,
  GradientPropertyDeclaration,
  PropertyDeclaration,
  SlotDeclaration,
  StateExpression,
  StateDeclaration,
  VariantExpression,
  VariantDeclaration,
  ComponentSpecDeclaration,
  ColorTokenDeclaration,
  DimensionTokenDeclaration,
  NumberTokenDeclaration,
  DurationTokenDeclaration,
  CubicBezierTokenDeclaration,
  ShadowTokenDeclaration,
  GradientTokenDeclaration,
  TokenDeclaration,
  TokenCollectionDeclaration,
  MetadataDeclaration,
  MetadataFieldDeclaration,
  ComponentSpecDocument,
  TokenCollectionsDocument,
  TokensDocument,
  UnresolvedTokenDeclaration,
  ColorTokenValueDeclaration,
  DimensionTokenValueDeclaration,
  NumberTokenValueDeclaration,
  DurationTokenValueDeclaration,
  CubicBezierTokenValueDeclaration,
  ShadowTokenValueDeclaration,
  GradientTokenValueDeclaration,
  UnresolvedTokenValueDeclaration,
  UnresolvedPropertyDeclaration,
  SchemaDeclaration,
  PropertySchemaDeclaration,
  SlotSchemaDeclaration,
  VariantSchemaDeclaration,
  VariantValueSchemaDeclaration,
} from "./ast";

/**
 * ColorHexLit factory
 */
export function createColorHexLit(value: `#${string}`): ColorHexLit {
  return {
    kind: "ColorHexLit",
    value,
  };
}

/**
 * DimensionLit factory
 */
export function createDimensionLit(value: number, unit: "px" | "rem"): DimensionLit {
  return {
    kind: "DimensionLit",
    value,
    unit,
  };
}

/**
 * DurationLit factory
 */
export function createDurationLit(value: number, unit: "ms" | "s"): DurationLit {
  return {
    kind: "DurationLit",
    value,
    unit,
  };
}

/**
 * NumberLit factory
 */
export function createNumberLit(value: number): NumberLit {
  return {
    kind: "NumberLit",
    value,
  };
}

/**
 * CubicBezierLit factory
 */
export function createCubicBezierLit(
  value: readonly [number, number, number, number],
): CubicBezierLit {
  return {
    kind: "CubicBezierLit",
    value,
  };
}

/**
 * ShadowLayerLit factory
 */
export function createShadowLayerLit(
  color: ColorHexLit | TokenLit,
  offsetX: DimensionLit,
  offsetY: DimensionLit,
  blur: DimensionLit,
  spread: DimensionLit,
): ShadowLayerLit {
  return {
    kind: "ShadowLayerLit",
    color,
    offsetX,
    offsetY,
    blur,
    spread,
  };
}

/**
 * ShadowLit factory
 */
export function createShadowLit(layers: ShadowLayerLit[]): ShadowLit {
  return {
    kind: "ShadowLit",
    layers,
  };
}

/**
 * GradientStopLit factory
 */
export function createGradientStopLit(
  color: ColorHexLit | TokenLit,
  position: NumberLit,
): GradientStopLit {
  return {
    kind: "GradientStopLit",
    color,
    position,
  };
}

/**
 * GradientLit factory
 */
export function createGradientLit(stops: GradientStopLit[]): GradientLit {
  return {
    kind: "GradientLit",
    stops,
  };
}

/**
 * TokenLit factory
 */
// "$brand.colors.primary" => group=["brand", "colors"], key="primary"
export function createTokenLit(identifier: string): TokenLit {
  if (typeof identifier !== "string" || !identifier.startsWith("$")) {
    throw new Error(`Invalid token identifier: ${identifier}`);
  }

  const bare = identifier.slice(1); // remove leading '$'
  const group = bare.split(".");
  if (group.length > 1) {
    const key = group.pop()!;
    return {
      kind: "TokenLit",
      identifier,
      group,
      key,
    } as TokenLit;
  }
  return {
    kind: "TokenLit",
    identifier,
    group,
    key: bare,
  } as TokenLit;
}

// -----------------------------------------------------------------------------
// Property Declarations
// -----------------------------------------------------------------------------

/**
 * ColorPropertyDeclaration factory
 */
export function createColorPropertyDeclaration(
  property: string,
  value: ColorHexLit | TokenLit,
): ColorPropertyDeclaration {
  return {
    kind: "ColorPropertyDeclaration",
    property,
    value,
  };
}

/**
 * DimensionPropertyDeclaration factory
 */
export function createDimensionPropertyDeclaration(
  property: string,
  value: DimensionLit | TokenLit,
): DimensionPropertyDeclaration {
  return {
    kind: "DimensionPropertyDeclaration",
    property,
    value,
  };
}

/**
 * NumberPropertyDeclaration factory
 */
export function createNumberPropertyDeclaration(
  property: string,
  value: NumberLit | TokenLit,
): NumberPropertyDeclaration {
  return {
    kind: "NumberPropertyDeclaration",
    property,
    value,
  };
}

/**
 * DurationPropertyDeclaration factory
 */
export function createDurationPropertyDeclaration(
  property: string,
  value: DurationLit | TokenLit,
): DurationPropertyDeclaration {
  return {
    kind: "DurationPropertyDeclaration",
    property,
    value,
  };
}

/**
 * CubicBezierPropertyDeclaration factory
 */
export function createCubicBezierPropertyDeclaration(
  property: string,
  value: CubicBezierLit | TokenLit,
): CubicBezierPropertyDeclaration {
  return {
    kind: "CubicBezierPropertyDeclaration",
    property,
    value,
  };
}

/**
 * ShadowPropertyDeclaration factory
 */
export function createShadowPropertyDeclaration(
  property: string,
  value: ShadowLit | TokenLit,
): ShadowPropertyDeclaration {
  return {
    kind: "ShadowPropertyDeclaration",
    property,
    value,
  };
}

/**
 * GradientPropertyDeclaration factory
 */
export function createGradientPropertyDeclaration(
  property: string,
  value: GradientLit | TokenLit,
): GradientPropertyDeclaration {
  return {
    kind: "GradientPropertyDeclaration",
    property,
    value,
  };
}

/**
 * UnresolvedPropertyDeclaration factory
 */
export function createUnresolvedPropertyDeclaration(
  property: string,
  value: TokenLit,
): UnresolvedPropertyDeclaration {
  return {
    kind: "UnresolvedPropertyDeclaration",
    property,
    value,
  };
}

// -----------------------------------------------------------------------------
// SlotDeclaration
// -----------------------------------------------------------------------------

/**
 * SlotDeclaration factory
 */
export function createSlotDeclaration(slot: string, body: PropertyDeclaration[]): SlotDeclaration {
  return {
    kind: "SlotDeclaration",
    slot,
    body,
  };
}

// -----------------------------------------------------------------------------
// State Expressions and Declarations
// -----------------------------------------------------------------------------

/**
 * StateExpression factory
 */
export function createStateExpression(value: string): StateExpression {
  return {
    kind: "StateExpression",
    value,
  };
}

/**
 * StateDeclaration factory
 */
export function createStateDeclaration(
  states: StateExpression[],
  body: SlotDeclaration[],
): StateDeclaration {
  return {
    kind: "StateDeclaration",
    states,
    body,
  };
}

// -----------------------------------------------------------------------------
// Variant Expressions and Declarations
// -----------------------------------------------------------------------------

/**
 * VariantExpression factory
 */
export function createVariantExpression(name: string, value: string): VariantExpression {
  return {
    kind: "VariantExpression",
    name,
    value,
  };
}

/**
 * VariantDeclaration factory
 */
export function createVariantDeclaration(
  variants: VariantExpression[],
  body: StateDeclaration[],
): VariantDeclaration {
  return {
    kind: "VariantDeclaration",
    variants,
    body,
  };
}

// -----------------------------------------------------------------------------
// SchemaDeclaration
// -----------------------------------------------------------------------------

/**
 * SchemaDeclaration factory
 */
export function createSchemaDeclaration(
  slots: SlotSchemaDeclaration[],
  variants: VariantSchemaDeclaration[],
): SchemaDeclaration {
  return {
    kind: "SchemaDeclaration",
    slots,
    variants,
  };
}

/**
 * SlotSchemaDeclaration factory
 */
export function createSlotSchemaDeclaration(
  name: string,
  properties: PropertySchemaDeclaration[],
  description?: string,
): SlotSchemaDeclaration {
  return {
    kind: "SlotSchemaDeclaration",
    name,
    properties,
    description,
  };
}

/**
 * PropertySchemaDeclaration factory
 */
export function createPropertySchemaDeclaration(
  name: string,
  type: "color" | "dimension" | "number" | "duration" | "cubicBezier" | "shadow" | "gradient",
  description?: string,
): PropertySchemaDeclaration {
  return {
    kind: "PropertySchemaDeclaration",
    name,
    type,
    description,
  };
}

/**
 * VariantSchemaDeclaration factory
 */
export function createVariantSchemaDeclaration(
  name: string,
  values: VariantValueSchemaDeclaration[],
  defaultValue: string,
  description?: string,
): VariantSchemaDeclaration {
  return {
    kind: "VariantSchemaDeclaration",
    name,
    values,
    defaultValue,
    description,
  };
}

/**
 * VariantValueSchemaDeclaration factory
 */
export function createVariantValueSchemaDeclaration(
  name: string,
  description?: string,
): VariantValueSchemaDeclaration {
  return {
    kind: "VariantValueSchemaDeclaration",
    name,
    description,
  };
}

// -----------------------------------------------------------------------------
// ComponentSpecDeclaration
// -----------------------------------------------------------------------------

/**
 * ComponentSpecDeclaration factory
 */
export function createComponentSpecDeclaration(
  id: string,
  name: string,
  schema: SchemaDeclaration,
  body: VariantDeclaration[],
): ComponentSpecDeclaration {
  return {
    kind: "ComponentSpecDeclaration",
    id,
    name,
    schema,
    body,
  };
}

// -----------------------------------------------------------------------------
// Token Declarations
// -----------------------------------------------------------------------------

/**
 * ColorTokenDeclaration factory
 */
export function createColorTokenDeclaration(
  collection: string,
  token: TokenLit,
  values: ColorTokenValueDeclaration[],
  description?: string,
): ColorTokenDeclaration {
  return {
    kind: "ColorTokenDeclaration",
    collection,
    token,
    values,
    description,
  };
}

/**
 * DimensionTokenDeclaration factory
 */
export function createDimensionTokenDeclaration(
  collection: string,
  token: TokenLit,
  values: DimensionTokenValueDeclaration[],
  description?: string,
): DimensionTokenDeclaration {
  return {
    kind: "DimensionTokenDeclaration",
    collection,
    token,
    values,
    description,
  };
}

/**
 * NumberTokenDeclaration factory
 */
export function createNumberTokenDeclaration(
  collection: string,
  token: TokenLit,
  values: NumberTokenValueDeclaration[],
  description?: string,
): NumberTokenDeclaration {
  return {
    kind: "NumberTokenDeclaration",
    collection,
    token,
    values,
    description,
  };
}

/**
 * DurationTokenDeclaration factory
 */
export function createDurationTokenDeclaration(
  collection: string,
  token: TokenLit,
  values: DurationTokenValueDeclaration[],
  description?: string,
): DurationTokenDeclaration {
  return {
    kind: "DurationTokenDeclaration",
    collection,
    token,
    values,
    description,
  };
}

/**
 * CubicBezierTokenDeclaration factory
 */
export function createCubicBezierTokenDeclaration(
  collection: string,
  token: TokenLit,
  values: CubicBezierTokenValueDeclaration[],
  description?: string,
): CubicBezierTokenDeclaration {
  return {
    kind: "CubicBezierTokenDeclaration",
    collection,
    token,
    values,
    description,
  };
}

/**
 * ShadowTokenDeclaration factory
 */
export function createShadowTokenDeclaration(
  collection: string,
  token: TokenLit,
  values: ShadowTokenValueDeclaration[],
  description?: string,
): ShadowTokenDeclaration {
  return {
    kind: "ShadowTokenDeclaration",
    collection,
    token,
    values,
    description,
  };
}

/**
 * GradientTokenDeclaration factory
 */
export function createGradientTokenDeclaration(
  collection: string,
  token: TokenLit,
  values: GradientTokenValueDeclaration[],
  description?: string,
): GradientTokenDeclaration {
  return {
    kind: "GradientTokenDeclaration",
    collection,
    token,
    values,
    description,
  };
}

/**
 * UnresolvedTokenDeclaration factory
 */
export function createUnresolvedTokenDeclaration(
  collection: string,
  token: TokenLit,
  values: UnresolvedTokenValueDeclaration[],
  description?: string,
): UnresolvedTokenDeclaration {
  return {
    kind: "UnresolvedTokenDeclaration",
    collection,
    token,
    values,
    description,
  };
}

/**
 * Helper function to create a TokenDeclaration based on the type of values
 */
export function createTokenDeclaration(
  collection: string,
  token: TokenLit,
  values:
    | ColorTokenValueDeclaration[]
    | DimensionTokenValueDeclaration[]
    | NumberTokenValueDeclaration[]
    | DurationTokenValueDeclaration[]
    | CubicBezierTokenValueDeclaration[]
    | ShadowTokenValueDeclaration[]
    | GradientTokenValueDeclaration[]
    | UnresolvedTokenValueDeclaration[],
  description?: string,
): TokenDeclaration {
  switch (values[0]!.kind) {
    case "ColorTokenValueDeclaration":
      return createColorTokenDeclaration(
        collection,
        token,
        values as ColorTokenValueDeclaration[],
        description,
      );
    case "DimensionTokenValueDeclaration":
      return createDimensionTokenDeclaration(
        collection,
        token,
        values as DimensionTokenValueDeclaration[],
        description,
      );
    case "NumberTokenValueDeclaration":
      return createNumberTokenDeclaration(
        collection,
        token,
        values as NumberTokenValueDeclaration[],
        description,
      );
    case "DurationTokenValueDeclaration":
      return createDurationTokenDeclaration(
        collection,
        token,
        values as DurationTokenValueDeclaration[],
        description,
      );
    case "CubicBezierTokenValueDeclaration":
      return createCubicBezierTokenDeclaration(
        collection,
        token,
        values as CubicBezierTokenValueDeclaration[],
        description,
      );
    case "ShadowTokenValueDeclaration":
      return createShadowTokenDeclaration(
        collection,
        token,
        values as ShadowTokenValueDeclaration[],
        description,
      );
    case "GradientTokenValueDeclaration":
      return createGradientTokenDeclaration(
        collection,
        token,
        values as GradientTokenValueDeclaration[],
        description,
      );
    case "UnresolvedTokenValueDeclaration":
      return createUnresolvedTokenDeclaration(
        collection,
        token,
        values as UnresolvedTokenValueDeclaration[],
        description,
      );
  }
}

// -----------------------------------------------------------------------------
// Token Value Declarations
// -----------------------------------------------------------------------------

/**
 * ColorTokenValueDeclaration factory
 */
export function createColorTokenValueDeclaration(
  mode: string,
  value: ColorHexLit | TokenLit,
): ColorTokenValueDeclaration {
  return {
    kind: "ColorTokenValueDeclaration",
    mode,
    value,
  };
}

/**
 * DimensionTokenValueDeclaration factory
 */
export function createDimensionTokenValueDeclaration(
  mode: string,
  value: DimensionLit | TokenLit,
): DimensionTokenValueDeclaration {
  return {
    kind: "DimensionTokenValueDeclaration",
    mode,
    value,
  };
}

/**
 * NumberTokenValueDeclaration factory
 */
export function createNumberTokenValueDeclaration(
  mode: string,
  value: NumberLit | TokenLit,
): NumberTokenValueDeclaration {
  return {
    kind: "NumberTokenValueDeclaration",
    mode,
    value,
  };
}

/**
 * DurationTokenValueDeclaration factory
 */
export function createDurationTokenValueDeclaration(
  mode: string,
  value: DurationLit | TokenLit,
): DurationTokenValueDeclaration {
  return {
    kind: "DurationTokenValueDeclaration",
    mode,
    value,
  };
}

/**
 * CubicBezierTokenValueDeclaration factory
 */
export function createCubicBezierTokenValueDeclaration(
  mode: string,
  value: CubicBezierLit | TokenLit,
): CubicBezierTokenValueDeclaration {
  return {
    kind: "CubicBezierTokenValueDeclaration",
    mode,
    value,
  };
}

/**
 * ShadowTokenValueDeclaration factory
 */
export function createShadowTokenValueDeclaration(
  mode: string,
  value: ShadowLit | TokenLit,
): ShadowTokenValueDeclaration {
  return {
    kind: "ShadowTokenValueDeclaration",
    mode,
    value,
  };
}

/**
 * GradientTokenValueDeclaration factory
 */
export function createGradientTokenValueDeclaration(
  mode: string,
  value: GradientLit | TokenLit,
): GradientTokenValueDeclaration {
  return {
    kind: "GradientTokenValueDeclaration",
    mode,
    value,
  };
}

/**
 * UnresolvedTokenValueDeclaration factory
 */
export function createUnresolvedTokenValueDeclaration(
  mode: string,
  value: TokenLit,
): UnresolvedTokenValueDeclaration {
  return {
    kind: "UnresolvedTokenValueDeclaration",
    mode,
    value,
  };
}

// -----------------------------------------------------------------------------
// Token Collection Declaration
// -----------------------------------------------------------------------------

/**
 * TokenCollectionDeclaration factory
 */
export function createTokenCollectionDeclaration(
  name: string,
  modes: string[],
): TokenCollectionDeclaration {
  return {
    kind: "TokenCollectionDeclaration",
    name,
    modes,
  };
}

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

/**
 * MetadataFieldDeclaration factory
 */
export function createMetadataFieldDeclaration(
  key: string,
  value: string | number | boolean,
): MetadataFieldDeclaration {
  return {
    kind: "MetadataFieldDeclaration",
    key,
    value,
  };
}

/**
 * MetadataDeclaration factory
 */
export function createMetadataDeclaration(fields: MetadataFieldDeclaration[]): MetadataDeclaration {
  return {
    kind: "MetadataDeclaration",
    fields,
  };
}

// -----------------------------------------------------------------------------
// Document Entry Points
// -----------------------------------------------------------------------------

/**
 * TokenCollectionsDocument factory
 */
export function createTokenCollectionsDocument(
  metadata: MetadataDeclaration,
  data: TokenCollectionDeclaration[],
): TokenCollectionsDocument {
  return {
    kind: "TokenCollectionsDocument",
    metadata,
    data,
  };
}

/**
 * TokensDocument factory
 */
export function createTokensDocument(
  metadata: MetadataDeclaration,
  data: TokenDeclaration[],
): TokensDocument {
  return {
    kind: "TokensDocument",
    metadata,
    data,
  };
}

/**
 * ComponentSpecDocument factory
 */
export function createComponentSpecDocument(
  metadata: MetadataDeclaration,
  data: ComponentSpecDeclaration,
): ComponentSpecDocument {
  return {
    kind: "ComponentSpecDocument",
    metadata,
    data,
  };
}
