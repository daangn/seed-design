import type { RootageCtx } from "./types";

interface ValidationResult {
  valid: boolean;
  message: string;
}

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
    const slotSchemaMap = new Map<string, Set<string>>();

    for (const slotSchema of componentSpec.schema.slots) {
      const propertyNames = new Set(slotSchema.properties.map((p) => p.name));

      slotSchemaMap.set(slotSchema.name, propertyNames);
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

          const schemaProperties = slotSchemaMap.get(slot.slot)!;

          for (const property of slot.body) {
            if (!schemaProperties.has(property.property)) {
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
          }
        }
      }
    }
  }

  return { valid: true, message: "" };
}
