import type {
  ComponentSpecDeclaration,
  ComponentSpecDocument,
  PropertyDeclaration,
  PropertySchemaDeclaration,
  SchemaDeclaration,
  SlotDeclaration,
  SlotSchemaDeclaration,
  StateDeclaration,
  VariantDeclaration,
  VariantSchemaDeclaration,
  VariantValueSchemaDeclaration,
} from "../ast";
import * as factory from "../factory";
import type * as Document from "./types";
import { isTokenRef } from "./is-token-ref";
import { parseMetadataDeclaration } from "./metadata";
import { parseValueAs } from "./value";

interface ParseContext {
  componentId: string;
  slotSchemas: Document.ComponentSpecSlotSchema;
}

export function parseComponentSpecDocument(
  model: Document.ComponentSpecModel,
): ComponentSpecDocument {
  return factory.createComponentSpecDocument(
    parseMetadataDeclaration(model.metadata),
    parseComponentSpecDeclaration(model),
  );
}

export function parseComponentSpecDeclaration(
  model: Document.ComponentSpecModel,
): ComponentSpecDeclaration {
  const { id, name } = model.metadata;

  const slotSchemas = model.data.schema?.slots ?? {};

  const body: VariantDeclaration[] = [];

  for (const [key, value] of Object.entries(model.data.definitions)) {
    body.push(parseVariantDeclaration(key, value, { componentId: id, slotSchemas }));
  }

  const inferredVariants = inferVariantSchema(model.data.definitions);
  const explicitVariants = model.data.schema?.variants ?? {};

  const mergedVariants: Document.ComponentSpecVariantSchema = { ...inferredVariants };

  for (const [variantName, explicitVariant] of Object.entries(explicitVariants)) {
    const inferredVariant = mergedVariants[variantName];

    if (inferredVariant) {
      mergedVariants[variantName] = {
        values: { ...inferredVariant.values, ...explicitVariant.values },
        defaultValue: explicitVariant.defaultValue ?? inferredVariant.defaultValue,
        description: explicitVariant.description ?? inferredVariant.description,
      };

      continue;
    }

    mergedVariants[variantName] = explicitVariant;
  }

  const schema = {
    slots: model.data.schema?.slots ?? {},
    variants: mergedVariants,
  };

  return factory.createComponentSpecDeclaration(id, name, parseSchemaDeclaration(schema), body);
}

function inferVariantSchema(
  definitions: Document.ComponentSpecDefinitions,
): Document.ComponentSpecVariantSchema {
  const result = new Map<string, Set<string>>();

  for (const variantExpr of Object.keys(definitions)) {
    const variant = parseVariantExpression(variantExpr);

    for (const key of Object.keys(variant)) {
      const values = result.get(key) ?? new Set();
      values.add(variant[key]!);
      result.set(key, values);
    }
  }

  const schema: Document.ComponentSpecVariantSchema = {};

  for (const [key, values] of result) {
    const valueSchema: Document.ComponentSpecVariantValueSchema = {};

    for (const value of values) {
      valueSchema[value] = {};
    }

    const defaultValue = values.values().next().value!;

    schema[key] = { values: valueSchema, defaultValue };
  }

  return schema;
}

function parseVariantExpression(variantExpression: string) {
  if (variantExpression === "base") {
    return {};
  }

  const keyValues = variantExpression.split(",").map((s) => s.trim());
  const variant: Record<string, string> = {};
  for (const keyValue of keyValues) {
    const [key, value] = keyValue.split("=");
    if (!key || !value) {
      throw new Error(`Invalid variant format: ${variantExpression}`);
    }

    variant[key] = value;
  }

  return variant;
}

function parseStateExpression(stateExpression: string) {
  return stateExpression.split(",");
}

function parseVariantDeclaration(
  key: string,
  decl: Document.ComponentSpecVariantDefinitions,
  ctx: ParseContext,
): VariantDeclaration {
  const variantExprs = Object.entries(parseVariantExpression(key)).map(([k, v]) =>
    factory.createVariantExpression(k, v),
  );

  // Convert definitions => array of StateDeclaration
  const stateDecls: StateDeclaration[] = Object.entries(decl).map(([k, v]) =>
    parseStateDeclaration(k, v, ctx),
  );

  return factory.createVariantDeclaration(variantExprs, stateDecls);
}

function parseStateDeclaration(
  key: string,
  decl: Record<string, Record<string, Document.Value>>,
  ctx: ParseContext,
): StateDeclaration {
  // We'll treat def.states as an array of strings => an array of StateExpression
  const stateExpressions = parseStateExpression(key).map((st) => factory.createStateExpression(st));

  // Convert slot data => array of SlotDeclaration
  const slotDecls: SlotDeclaration[] = [];

  for (const [slotName, props] of Object.entries(decl)) {
    const propertySchemas = ctx.slotSchemas[slotName]?.properties;
    const propertyDecls: PropertyDeclaration[] = [];

    for (const [propKey, lhValue] of Object.entries(props)) {
      propertyDecls.push(
        parsePropertyDeclaration(propKey, lhValue, {
          declaredType: propertySchemas?.[propKey]?.type,
          context: `Property "${propKey}" of slot "${slotName}" in component spec "${ctx.componentId}"`,
        }),
      );
    }

    slotDecls.push(factory.createSlotDeclaration(slotName, propertyDecls));
  }

  return factory.createStateDeclaration(stateExpressions, slotDecls);
}

/**
 * Turn a property name + Document.Value => one of property declarations
 * (ColorPropertyDeclaration, DimensionPropertyDeclaration, etc.).
 *
 * The token-reference check runs ahead of the type dispatch: an alias looks the
 * same whatever it points at, so it is well-formed under every declared type, and
 * whether the two actually agree is checked against the resolved token later (see
 * analyzer/validate.ts).
 */
function parsePropertyDeclaration(
  property: string,
  lhValue: Document.Value,
  { declaredType, context }: { declaredType?: PropertySchemaDeclaration["type"]; context: string },
): PropertyDeclaration {
  if (!declaredType) {
    throw new Error(`${context} is not declared in the slot schema.`);
  }

  if (isTokenRef(lhValue)) {
    return factory.createUnresolvedPropertyDeclaration(property, factory.createTokenLit(lhValue));
  }

  const valueLit = parseValueAs(declaredType, lhValue, context);
  switch (valueLit.kind) {
    case "ColorHexLit":
      return factory.createColorPropertyDeclaration(property, valueLit);

    case "DimensionLit":
      return factory.createDimensionPropertyDeclaration(property, valueLit);

    case "NumberLit":
      return factory.createNumberPropertyDeclaration(property, valueLit);

    case "DurationLit":
      return factory.createDurationPropertyDeclaration(property, valueLit);

    case "CubicBezierLit":
      return factory.createCubicBezierPropertyDeclaration(property, valueLit);

    case "ShadowLit":
      return factory.createShadowPropertyDeclaration(property, valueLit);

    case "GradientLit":
      return factory.createGradientPropertyDeclaration(property, valueLit);
  }
}

function parsePropertySchemaDeclaration(
  model: Document.ComponentSpecPropertySchema,
): PropertySchemaDeclaration[] {
  return Object.entries(model).map(([name, { type, description }]) =>
    factory.createPropertySchemaDeclaration(name, type, description),
  );
}

function parseSlotSchemaDeclaration(
  model: Document.ComponentSpecSlotSchema,
): SlotSchemaDeclaration[] {
  return Object.entries(model).map(([key, value]) => {
    return factory.createSlotSchemaDeclaration(
      key,
      parsePropertySchemaDeclaration(value.properties),
      value.description,
    );
  });
}

function parseVariantValueSchemaDeclaration(
  model: Document.ComponentSpecVariantValueSchema,
): VariantValueSchemaDeclaration[] {
  return Object.entries(model).map(([key, value]) => {
    return factory.createVariantValueSchemaDeclaration(key, value.description);
  });
}

function parseVariantSchemaDeclaration(
  model: Document.ComponentSpecVariantSchema,
): VariantSchemaDeclaration[] {
  return Object.entries(model).map(([key, value]) => {
    return factory.createVariantSchemaDeclaration(
      key,
      parseVariantValueSchemaDeclaration(value.values),
      value.defaultValue,
      value.description,
    );
  });
}

// `Required` because the caller has already merged the inferred variant axes in,
// so both halves are resolved by the time they reach here.
function parseSchemaDeclaration(model: Required<Document.ComponentSpecSchema>): SchemaDeclaration {
  return factory.createSchemaDeclaration(
    parseSlotSchemaDeclaration(model.slots),
    parseVariantSchemaDeclaration(model.variants),
  );
}
