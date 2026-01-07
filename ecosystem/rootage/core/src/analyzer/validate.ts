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
      if (!collection.modes.includes(mode)) {
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
    const slotSchemaMap = new Map<string, Map<string, PropertySchemaDeclaration["type"]>>();

    for (const slotSchema of componentSpec.schema.slots) {
      const propertyTypeMap = new Map<string, PropertySchemaDeclaration["type"]>();
      for (const prop of slotSchema.properties) {
        propertyTypeMap.set(prop.name, prop.type);
      }
      slotSchemaMap.set(slotSchema.name, propertyTypeMap);
    }

    for (const variant of componentSpec.body) {
      for (const state of variant.body) {
        for (const slot of state.body) {
          if (!slotSchemaMap.has(slot.slot)) {
            return {
              valid: false,
              message: `Slot "${slot.slot}" is not defined in schema but used in component spec "${componentSpec.name}"`,
            };
          }

          const propertyTypeMap = slotSchemaMap.get(slot.slot)!;

          for (const property of slot.body) {
            if (!propertyTypeMap.has(property.property)) {
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

            const expectedType = propertyTypeMap.get(property.property)!;
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
          }
        }
      }
    }
  }

  return { valid: true, message: "" };
}
