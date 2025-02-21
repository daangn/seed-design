import { type AST, factory, visitEachChild, visitNode } from "../parser";
import type { Node, TokenRef } from "../parser/ast";
import type { ComponentSpecRef, ResolvedTokenResult, RootageCtx } from "./types";

export function resolveToken(
  rootage: Pick<RootageCtx, "dependencyGraph" | "tokenEntities">,
  tokenId: TokenRef,
  modes: Record<string, string>,
): ResolvedTokenResult {
  const { dependencyGraph, tokenEntities } = rootage;

  function rec(name: TokenRef): TokenRef[] {
    const node = dependencyGraph[name];

    if (!node) {
      throw new Error(`Token not found: ${name}`);
    }

    const mode = modes[node.collection];

    if (!mode) {
      throw new Error(`${node.collection} does not exist in modes`);
    }

    const nextNode = node.dependencies[mode];

    if (nextNode) {
      return [node.name, ...rec(nextNode)];
    }

    return [node.name];
  }

  const path = rec(tokenId);
  const last = path.at(-1)!;
  const resolvedToken = tokenEntities[last];

  if (!resolvedToken) {
    throw new Error(`Token not found: ${last}`);
  }

  const value = resolvedToken.values.find((v) => v.mode === modes[resolvedToken.collection])?.value;

  if (!value) {
    throw new Error(
      `Value not found for ${resolvedToken.collection}=${modes[resolvedToken.collection]} in ${JSON.stringify(resolvedToken.values, null, 2)}`,
    );
  }

  if (value.kind === "TokenLit") {
    throw new Error(`Unexpected resolved token type: ${value}`);
  }

  return { path, value };
}

export function resolveReferences(
  rootage: RootageCtx,
  tokenId: TokenRef,
  modes: Record<string, string>,
): (TokenRef | ComponentSpecRef)[] {
  const { referenceGraph } = rootage;

  function rec(name: TokenRef): (TokenRef | ComponentSpecRef)[] {
    const node = referenceGraph[name];

    if (!node) {
      return [];
    }

    const mode = modes[node.collection];

    if (!mode) {
      throw new Error(`${node.collection} does not exist in modes`);
    }

    return node.references[mode]!.flatMap((ref) => [ref, ...rec(ref as TokenRef)]);
  }

  return rec(tokenId);
}

export function transformResolvedType<T extends AST.Node | AST.Node[]>(
  ctx: Pick<RootageCtx, "dependencyGraph" | "tokenCollectionEntities" | "tokenEntities">,
  node: T,
): T {
  function visit(node: Node): Node {
    if (node.kind === "UnresolvedTokenDeclaration") {
      const values = node.values.map((valueDecl) => {
        const resolved = resolveToken(ctx, valueDecl.value.identifier, {
          [node.collection]: valueDecl.mode,
        });
        switch (resolved.value.kind) {
          case "ColorHexLit":
            return factory.createColorTokenValueDeclaration(valueDecl.mode, valueDecl.value);
          case "DimensionLit":
            return factory.createDimensionTokenValueDeclaration(valueDecl.mode, valueDecl.value);
          case "NumberLit":
            return factory.createNumberTokenValueDeclaration(valueDecl.mode, valueDecl.value);
          case "DurationLit":
            return factory.createDurationTokenValueDeclaration(valueDecl.mode, valueDecl.value);
          case "CubicBezierLit":
            return factory.createCubicBezierTokenValueDeclaration(valueDecl.mode, valueDecl.value);
          case "ShadowLit":
            return factory.createShadowTokenValueDeclaration(valueDecl.mode, valueDecl.value);
          case "GradientLit":
            return factory.createGradientTokenValueDeclaration(valueDecl.mode, valueDecl.value);
          default:
            throw new Error(`Unexpected resolved token type ${valueDecl.value}`);
        }
      }) as AST.TokenDeclaration["values"];

      return factory.createTokenDeclaration(node.collection, node.token, values, node.description);
    }

    if (node.kind === "UnresolvedPropertyDeclaration") {
      const resolved = resolveToken(ctx, node.value.identifier, {
        [ctx.dependencyGraph[node.value.identifier]!.collection]:
          ctx.tokenCollectionEntities[ctx.dependencyGraph[node.value.identifier]!.collection]!
            .modes[0]!,
      });
      switch (resolved.value.kind) {
        case "ColorHexLit":
          return factory.createColorPropertyDeclaration(node.property, node.value);
        case "DimensionLit":
          return factory.createDimensionPropertyDeclaration(node.property, node.value);
        case "NumberLit":
          return factory.createNumberPropertyDeclaration(node.property, node.value);
        case "DurationLit":
          return factory.createDurationPropertyDeclaration(node.property, node.value);
        case "CubicBezierLit":
          return factory.createCubicBezierPropertyDeclaration(node.property, node.value);
        case "ShadowLit":
          return factory.createShadowPropertyDeclaration(node.property, node.value);
        case "GradientLit":
          return factory.createGradientPropertyDeclaration(node.property, node.value);
        default:
          throw new Error(`Unexpected resolved token type: ${resolved.value}`);
      }
    }

    return visitEachChild(node, visit);
  }

  const transformed = Array.isArray(node)
    ? node.map((n) => visitNode(n, visit))
    : visitNode(node, visit);

  return transformed as T;
}
