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
import { isTokenRef } from "./is-token-ref";
import { parseMetadataDeclaration } from "./metadata";
import { parseValueAs } from "./value";

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

  const slotSchemas = model.data.schema.slots;
  const variantOrder = Object.keys(model.data.schema.variants ?? {});
  const stateOrder = (model.data.schema.states ?? []).map((state) => state.id);

  const rules = model.data.rules.map((rule) =>
    parseRuleDeclaration(rule, { componentId: id, slotSchemas, variantOrder, stateOrder }),
  );

  return factory.createComponentSpecDeclaration(
    id,
    name,
    parseSchemaDeclaration(model.data.schema),
    rules,
  );
}

interface ParseContext {
  componentId: string;
  slotSchemas: Document.ComponentSpecSlotSchema;
  variantOrder: string[];
  stateOrder: string[];
}

/**
 * Axes and states are re-sorted into schema order rather than kept as written, so
 * two documents that name the same region always produce the same declaration —
 * `[selected, pressed]` and `[pressed, selected]` cannot resolve differently.
 * `analyzer/validate.ts` separately rejects the unsorted spelling, keeping the
 * checked-in files down to one form too.
 */
function parseRuleDeclaration(
  rule: Document.ComponentSpecRule,
  ctx: ParseContext,
): RuleDeclaration {
  const variants = Object.entries(rule.variants ?? {})
    .sort(([a], [b]) => ctx.variantOrder.indexOf(a) - ctx.variantOrder.indexOf(b))
    .map(([name, value]) => factory.createVariantExpression(name, value));

  const states = [...(rule.states ?? [])]
    .sort((a, b) => ctx.stateOrder.indexOf(a) - ctx.stateOrder.indexOf(b))
    .map((state) => factory.createStateExpression(state));

  const slots: SlotDeclaration[] = [];

  for (const [slotName, props] of Object.entries(rule.slots)) {
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

    slots.push(factory.createSlotDeclaration(slotName, propertyDecls));
  }

  return factory.createRuleDeclaration(variants, states, slots);
}

/**
 * Turn a property name + Document.PropertyValue => one of property declarations
 * (ColorPropertyDeclaration, DimensionPropertyDeclaration, etc.).
 *
 * The token-reference check runs ahead of the type dispatch: an alias looks the
 * same whatever it points at, so it is well-formed under every declared type, and
 * whether the two actually agree is checked against the resolved token later (see
 * analyzer/validate.ts).
 */
function parsePropertyDeclaration(
  property: string,
  lhValue: Document.PropertyValue,
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

    case "EnumLit":
      return factory.createEnumPropertyDeclaration(property, valueLit);

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
    factory.createStateSchemaDeclaration(state.id, state.suppresses ?? [], state.description),
  );
}

function parseSchemaDeclaration(model: Document.ComponentSpecSchema): SchemaDeclaration {
  return factory.createSchemaDeclaration(
    parseSlotSchemaDeclaration(model.slots),
    parseVariantSchemaDeclaration(model.variants ?? {}),
    parseStateSchemaDeclaration(model.states ?? []),
  );
}
