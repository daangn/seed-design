import type { Node } from "./ast";

export function visitNode(node: Node, fn: (node: Node) => Node): Node {
  const result = fn(node);
  return result;
}

export function visitEachChild<T extends Node>(node: T, fn: (node: Node) => Node): T {
  switch (node.kind) {
    case "ColorHexLit":
    case "DimensionLit":
    case "NumberLit":
    case "DurationLit":
    case "CubicBezierLit":
    case "ShadowLayerLit":
    case "GradientStopLit":
    case "TokenLit":
      return node;
    case "ShadowLit":
      return {
        ...node,
        layers: node.layers.map((layer) => fn(layer)),
      };
    case "GradientLit":
      return {
        ...node,
        stops: node.stops.map((stop) => fn(stop)),
      };
    case "MetadataDeclaration":
      return {
        ...node,
        fields: node.fields.map((field) => fn(field)),
      };
    case "MetadataFieldDeclaration":
      return node;

    // Tokens
    case "TokensDocument":
      return {
        ...node,
        metadata: fn(node.metadata),
        data: node.data.map((decl) => fn(decl)),
      };
    case "ColorTokenDeclaration":
    case "DimensionTokenDeclaration":
    case "NumberTokenDeclaration":
    case "DurationTokenDeclaration":
    case "CubicBezierTokenDeclaration":
    case "ShadowTokenDeclaration":
    case "GradientTokenDeclaration":
    case "UnresolvedTokenDeclaration":
      return {
        ...node,
        values: node.values.map((value) => fn(value)),
      };
    case "ColorTokenValueDeclaration":
    case "DimensionTokenValueDeclaration":
    case "NumberTokenValueDeclaration":
    case "DurationTokenValueDeclaration":
    case "CubicBezierTokenValueDeclaration":
    case "ShadowTokenValueDeclaration":
    case "GradientTokenValueDeclaration":
    case "UnresolvedTokenValueDeclaration":
      return {
        ...node,
        value: fn(node.value),
      };

    // TokenCollections
    case "TokenCollectionsDocument":
      return {
        ...node,
        metadata: fn(node.metadata),
        data: node.data.map((decl) => fn(decl)),
      };
    case "TokenCollectionDeclaration":
      return node;

    // ComponentSpec
    case "ComponentSpecDocument":
      return {
        ...node,
        metadata: fn(node.metadata),
        data: fn(node.data),
      };
    case "ComponentSpecDeclaration":
      return {
        ...node,
        body: node.body.map((body) => fn(body)),
      };
    case "VariantDeclaration":
      return {
        ...node,
        variants: node.variants.map((variant) => fn(variant)),
        body: node.body.map((body) => fn(body)),
      };
    case "VariantExpression":
      return node;
    case "StateDeclaration":
      return {
        ...node,
        states: node.states.map((state) => fn(state)),
        body: node.body.map((body) => fn(body)),
      };
    case "StateExpression":
      return node;
    case "SlotDeclaration":
      return {
        ...node,
        body: node.body.map((body) => fn(body)),
      };
    case "ColorPropertyDeclaration":
    case "DimensionPropertyDeclaration":
    case "NumberPropertyDeclaration":
    case "DurationPropertyDeclaration":
    case "CubicBezierPropertyDeclaration":
    case "ShadowPropertyDeclaration":
    case "GradientPropertyDeclaration":
    case "UnresolvedPropertyDeclaration":
      return {
        ...node,
        value: fn(node.value),
      };
  }
}
