import type {
  ComponentSpecDeclaration,
  ComponentSpecDocument,
  PropertyDeclaration,
  PropertySchemaDeclaration,
  RuleDeclaration,
  SchemaDeclaration,
  SlotDeclaration,
  SlotSchemaDeclaration,
  StateSchemaDeclaration,
  VariantSchemaDeclaration,
  VariantValueSchemaDeclaration,
} from "../ast";
import * as factory from "../factory";
import type * as Document from "./types";
import { parseMetadataDeclaration } from "./metadata";
import {
  parseColorValue,
  parseCubicBezierValue,
  parseEnumValue,
  parseDimensionValue,
  parseDurationValue,
  parseGradientValue,
  parseNumberValue,
  parseShadowValue,
} from "./value";

export function parseComponentSpecDocument(
  model: Document.ComponentSpecModel,
): ComponentSpecDocument {
  return factory.createComponentSpecDocument(
    parseMetadataDeclaration(model.metadata),
    parseComponentSpecDeclaration(model.data),
  );
}

export function parseComponentSpecDeclaration(
  data: Document.ComponentSpecData,
): ComponentSpecDeclaration {
  const { id, name } = data;

  return factory.createComponentSpecDeclaration(
    id,
    name,
    parseSchemaDeclaration(data.schema),
    data.rules.map((rule) => parseRuleDeclaration(rule)),
  );
}

function parseRuleDeclaration(rule: Document.Rule): RuleDeclaration {
  const variantExprs = Object.entries(rule.variants).map(([k, v]) =>
    factory.createVariantExpression(k, v),
  );
  const stateExprs = rule.states.map((st) => factory.createStateExpression(st));

  const slotDecls: SlotDeclaration[] = [];

  for (const [slotName, props] of Object.entries(rule.slots)) {
    const propertyDecls: PropertyDeclaration[] = [];

    for (const [propKey, lhValue] of Object.entries(props)) {
      propertyDecls.push(parsePropertyDeclaration(propKey, lhValue));
    }

    slotDecls.push(factory.createSlotDeclaration(slotName, propertyDecls));
  }

  return factory.createRuleDeclaration(variantExprs, stateExprs, slotDecls);
}

/**
 * Turn a property name + Document.Value => one of property declarations
 * (ColorPropertyDeclaration, DimensionPropertyDeclaration, etc.).
 */
function parsePropertyDeclaration(property: string, lhValue: Document.Value): PropertyDeclaration {
  switch (lhValue.type) {
    case "color":
      return factory.createColorPropertyDeclaration(property, parseColorValue(lhValue));

    case "dimension":
      return factory.createDimensionPropertyDeclaration(property, parseDimensionValue(lhValue));

    case "number":
      return factory.createNumberPropertyDeclaration(property, parseNumberValue(lhValue));

    case "duration":
      return factory.createDurationPropertyDeclaration(property, parseDurationValue(lhValue));

    case "enum":
      return factory.createEnumPropertyDeclaration(property, parseEnumValue(lhValue));

    case "cubicBezier":
      return factory.createCubicBezierPropertyDeclaration(property, parseCubicBezierValue(lhValue));

    case "shadow":
      return factory.createShadowPropertyDeclaration(property, parseShadowValue(lhValue));

    case "gradient":
      return factory.createGradientPropertyDeclaration(property, parseGradientValue(lhValue));
  }
}

function parsePropertySchemaDeclaration(
  model: Document.ComponentSpecPropertySchema,
): PropertySchemaDeclaration[] {
  return Object.entries(model).map(([name, schema]) =>
    factory.createPropertySchemaDeclaration(name, schema),
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

function parseStateSchemaDeclaration(
  model: Document.ComponentSpecStateSchema,
): StateSchemaDeclaration[] {
  return model.map((state) =>
    factory.createStateSchemaDeclaration(state.id, state.suppresses, state.description),
  );
}

function parseSchemaDeclaration(model: Document.ComponentSpecSchema): SchemaDeclaration {
  return factory.createSchemaDeclaration(
    parseSlotSchemaDeclaration(model.slots),
    parseVariantSchemaDeclaration(model.variants),
    parseStateSchemaDeclaration(model.states),
  );
}
