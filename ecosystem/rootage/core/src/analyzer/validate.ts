import type { PropertySchemaDeclaration, TokenDeclaration, ValueLit } from "../parser/ast";
import type { RootageCtx } from "./types";

interface ValidationResult {
  valid: boolean;
  message: string;
}

// this might live in ast.ts later but not sure: *Lit["kind"] already shows its type
const LITERAL_KIND_TO_TYPE: Record<ValueLit["kind"], PropertySchemaDeclaration["type"]> = {
  ColorHexLit: "color",
  DimensionLit: "dimension",
  NumberLit: "number",
  EnumLit: "enum",
  DurationLit: "duration",
  CubicBezierLit: "cubicBezier",
  ShadowLit: "shadow",
  GradientLit: "gradient",
};

// this might live in ast.ts later but not sure: *PropertyDeclaration["kind"] already shows its type
const TOKEN_DECL_KIND_TO_TYPE: Omit<
  Record<TokenDeclaration["kind"], PropertySchemaDeclaration["type"]>,
  "UnresolvedTokenDeclaration"
> = {
  ColorTokenDeclaration: "color",
  DimensionTokenDeclaration: "dimension",
  NumberTokenDeclaration: "number",
  DurationTokenDeclaration: "duration",
  CubicBezierTokenDeclaration: "cubicBezier",
  ShadowTokenDeclaration: "shadow",
  GradientTokenDeclaration: "gradient",
};

// TODO: detect cycle in dependency graph
export function validate(ctx: RootageCtx): ValidationResult {
  const {
    componentSpecIds,
    componentSpecEntities,
    tokenIds,
    tokenEntities,
    tokenCollectionIds,
    tokenCollectionEntities,
  } = ctx;
  const componentSpecs = componentSpecIds.map((id) => componentSpecEntities[id]!);
  const tokens = tokenIds.map((id) => tokenEntities[id]!);
  const tokenCollections = tokenCollectionIds.map((id) => tokenCollectionEntities[id]!);

  // validate collection names
  const collectionNames = tokenCollections.map((collection) => collection.name);
  const collectionNameSet = new Set(collectionNames);

  for (const tokenBinding of tokens) {
    if (!collectionNameSet.has(tokenBinding.collection)) {
      return {
        valid: false,
        message: `Token collection "${tokenBinding.collection}" is not defined but used in "${tokenBinding.token.identifier}"`,
      };
    }
  }

  // validate collection modes
  for (const tokenBinding of tokens) {
    const collection = tokenCollections.find(
      (collection) => collection.name === tokenBinding.collection,
    )!;
    for (const { mode } of tokenBinding.values) {
      if (!collection.modes.some((m) => m.id === mode)) {
        return {
          valid: false,
          message: `Mode "${mode}" is not defined in token collection "${tokenBinding.collection}" but used in "${tokenBinding.token.identifier}"`,
        };
      }
    }
  }

  // validate token references
  const tokenNames = tokens.map((binding) => binding.token.identifier);
  const tokenNameSet = new Set(tokenNames);

  const tokenTypeMap = new Map<string, PropertySchemaDeclaration["type"]>();
  for (const tokenBinding of tokens) {
    // when tokens like $color.fg.brand is used, just skip
    // TODO: we might resolve -> validate OR resolve in validate but not sure if they're appropriate
    if (tokenBinding.kind === "UnresolvedTokenDeclaration") continue;

    tokenTypeMap.set(tokenBinding.token.identifier, TOKEN_DECL_KIND_TO_TYPE[tokenBinding.kind]);
  }

  for (const tokenBinding of tokens) {
    for (const { value } of tokenBinding.values) {
      if (value.kind === "TokenLit") {
        const tokenName = value.identifier;
        if (!tokenNameSet.has(tokenName)) {
          return {
            valid: false,
            message: `Token "${tokenName}" is not defined but used in "${tokenBinding.token.identifier}"`,
          };
        }
      }
    }
  }

  for (const componentSpec of componentSpecs) {
    const slotSchemaMap = new Map<string, Map<string, PropertySchemaDeclaration>>();

    for (const slotSchema of componentSpec.schema.slots) {
      const propertySchemaMap = new Map<string, PropertySchemaDeclaration>();
      for (const prop of slotSchema.properties) {
        if (prop.type === "enum") {
          if (prop.values.length === 0) {
            return {
              valid: false,
              message: `Property "${prop.name}" in slot "${slotSchema.name}" is an enum with no values in component spec "${componentSpec.name}"`,
            };
          }

          // A `$`-prefixed value is indistinguishable from a token reference, and
          // the reference wins: the parser resolves it before it ever reaches the
          // enum. Such a value could never be written, so reject the declaration.
          const tokenLike = prop.values.find((value) => value.startsWith("$"));
          if (tokenLike) {
            return {
              valid: false,
              message: `Enum value "${tokenLike}" of property "${prop.name}" in slot "${slotSchema.name}" starts with "$" and would be read as a token reference in component spec "${componentSpec.name}"`,
            };
          }
        }

        propertySchemaMap.set(prop.name, prop);
      }
      slotSchemaMap.set(slotSchema.name, propertySchemaMap);
    }

    const usedProperties = new Map<string, Set<string>>();
    for (const slotSchema of componentSpec.schema.slots) {
      usedProperties.set(slotSchema.name, new Set());
    }

    for (const variant of componentSpec.body) {
      for (const state of variant.body) {
        for (const slot of state.body) {
          const propertySchemaMap = slotSchemaMap.get(slot.slot);
          if (!propertySchemaMap) {
            return {
              valid: false,
              message: `Slot "${slot.slot}" is not defined in schema but used in component spec "${componentSpec.name}"`,
            };
          }

          for (const property of slot.body) {
            usedProperties.get(slot.slot)?.add(property.property);

            const propertySchema = propertySchemaMap.get(property.property);
            if (!propertySchema) {
              return {
                valid: false,
                message: `Property "${property.property}" is not defined in slot "${slot.slot}" schema but used in component spec "${componentSpec.name}"`,
              };
            }

            if (property.value.kind === "TokenLit") {
              const tokenName = property.value.identifier;
              if (!tokenNameSet.has(tokenName)) {
                return {
                  valid: false,
                  message: `Token "${tokenName}" is not defined but used in component spec "${componentSpec.name}"`,
                };
              }
            }

            const expectedType = propertySchema.type;
            const actualType = (() => {
              switch (property.value.kind) {
                case "TokenLit":
                  return tokenTypeMap.get(property.value.identifier);

                default:
                  return LITERAL_KIND_TO_TYPE[property.value.kind];
              }
            })();

            if (actualType && actualType !== expectedType) {
              return {
                valid: false,
                message: `Property "${property.property}" expects type "${expectedType}" but got "${actualType}" in component spec "${componentSpec.name}"`,
              };
            }

            if (
              propertySchema.type === "enum" &&
              property.value.kind === "EnumLit" &&
              !propertySchema.values.includes(property.value.value)
            ) {
              return {
                valid: false,
                message: `Property "${property.property}" expects one of ${propertySchema.values.map((value) => `"${value}"`).join(", ")} but got "${property.value.value}" in component spec "${componentSpec.name}"`,
              };
            }
          }
        }
      }
    }

    for (const slotSchema of componentSpec.schema.slots) {
      const usedProps = usedProperties.get(slotSchema.name) ?? new Set();
      for (const prop of slotSchema.properties) {
        if (!usedProps.has(prop.name)) {
          return {
            valid: false,
            message: `Property "${prop.name}" in slot "${slotSchema.name}" is defined in schema but never used in definitions of component spec "${componentSpec.name}"`,
          };
        }
      }
    }
  }

  return { valid: true, message: "" };
}
