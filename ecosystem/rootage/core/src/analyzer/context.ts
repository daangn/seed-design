import type {
  ComponentSpecDeclaration,
  TokenCollectionDeclaration,
  TokenDeclaration,
  TokenRef,
} from "../parser/ast";
import { transformResolvedType } from "./resolver";
import { stringifyStateExpression, stringifyVariantExpression } from "./stringify";
import type { DependencyGraph, ReferenceGraph, RootageCtx, SourceFile } from "./types";

function buildDependencyGraph(tokenDecls: TokenDeclaration[]): DependencyGraph {
  const graph: DependencyGraph = {};

  for (const tokenDecl of tokenDecls) {
    const { token } = tokenDecl;
    const name = token.identifier;
    const dependencies: { [mode: string]: TokenRef } = {};

    for (const { mode, value } of tokenDecl.values) {
      if (value.kind === "TokenLit") {
        const ref = value.identifier;
        dependencies[mode] = ref;
      }
    }

    graph[name] = { name, collection: tokenDecl.collection, dependencies };
  }

  return graph;
}

function buildReferenceGraph(
  tokenDecls: TokenDeclaration[],
  componentSpecs: ComponentSpecDeclaration[],
): ReferenceGraph {
  const graph: ReferenceGraph = {};

  // Initialize reference graph
  for (const tokenDecl of tokenDecls) {
    const { token } = tokenDecl;
    const name = token.identifier;
    const references: { [collection: string]: TokenRef[] } = {};

    for (const { mode } of tokenDecl.values) {
      references[mode] = [];
    }

    graph[name] = { name, collection: tokenDecl.collection, references };
  }

  // Add token references
  for (const tokenDecl of tokenDecls) {
    const { token } = tokenDecl;
    const name = token.identifier;

    for (const { mode, value } of tokenDecl.values) {
      if (value.kind === "TokenLit") {
        const ref = value.identifier;
        graph[ref]?.references[mode]?.push(name);
      }
    }
  }

  // Add component spec references
  for (const componentSpec of componentSpecs) {
    const { id, body } = componentSpec;

    for (const { variants: variantKey, body: state } of body) {
      for (const { states: stateKey, body: slot } of state) {
        for (const { slot: slotKey, body: property } of slot) {
          for (const { property: propertyKey, value } of property) {
            if (value.kind === "TokenLit") {
              const tokenName = value.identifier;
              const componentRef = `${id}/${stringifyVariantExpression(variantKey)}/${stringifyStateExpression(stateKey)}/${slotKey}/${propertyKey}`;
              for (const mode in graph[tokenName]?.references) {
                graph[tokenName]?.references[mode]?.push(componentRef);
              }
            }
          }
        }
      }
    }
  }

  return graph;
}

export function buildContext(files: SourceFile[]): RootageCtx {
  const tokens = files
    .map((x) => x.ast)
    .filter((x) => x.kind === "TokensDocument")
    .flatMap((x) => x.data);
  const tokenCollections = files
    .map((x) => x.ast)
    .filter((x) => x.kind === "TokenCollectionsDocument")
    .flatMap((x) => x.data);
  const componentSpecs = files
    .map((x) => x.ast)
    .filter((x) => x.kind === "ComponentSpecDocument")
    .map((x) => x.data);

  const tokenIds = tokens.map((x) => x.token.identifier);
  const tokenEntities = Object.fromEntries(tokens.map((x) => [x.token.identifier, x]));
  const tokenCollectionIds = tokenCollections.map((x) => x.name);
  const tokenCollectionEntities = Object.fromEntries(tokenCollections.map((x) => [x.name, x]));
  const componentSpecIds = componentSpecs.map((x) => x.id);
  const componentSpecEntities = Object.fromEntries(componentSpecs.map((x) => [x.id, x]));
  const dependencyGraph = buildDependencyGraph(tokens);
  const referenceGraph = buildReferenceGraph(tokens, componentSpecs);

  return {
    sourceFiles: files,
    tokenIds,
    tokenEntities,
    tokenCollectionIds,
    tokenCollectionEntities,
    componentSpecIds,
    componentSpecEntities,
    dependencyGraph,
    referenceGraph,
  };
}

export function getSourceFiles(ctx: RootageCtx): SourceFile[] {
  return ctx.sourceFiles.map((s) => ({ ...s, ast: transformResolvedType(ctx, s.ast) }));
}

export function getTokenDeclarations(ctx: RootageCtx): TokenDeclaration[] {
  return ctx.tokenIds.map((id) => transformResolvedType(ctx, ctx.tokenEntities[id]!));
}

export function getTokenCollectionDeclarations(ctx: RootageCtx): TokenCollectionDeclaration[] {
  return ctx.tokenCollectionIds.map((id) =>
    transformResolvedType(ctx, ctx.tokenCollectionEntities[id]!),
  );
}

export function getComponentSpecDeclarations(ctx: RootageCtx): ComponentSpecDeclaration[] {
  return ctx.componentSpecIds.map((id) =>
    transformResolvedType(ctx, ctx.componentSpecEntities[id]!),
  );
}
