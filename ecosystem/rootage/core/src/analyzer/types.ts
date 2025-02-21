import type * as AST from "../parser/ast";
import type { TokenRef } from "../parser/exchange/types";

// resolver
export interface ResolvedTokenResult {
  path: TokenRef[];
  value: AST.ValueLit;
}

// ctx
export interface DependencyNode {
  name: TokenRef;
  collection: string;
  dependencies: {
    [mode: string]: TokenRef | undefined;
  };
}

export interface DependencyGraph {
  [tokenRef: TokenRef]: DependencyNode;
}

export type ComponentSpecRef = string; // {ComponentSpecId}.{VariantExpression}.{State}.{Slot}.{Property}
export interface ReferenceNode {
  name: TokenRef;
  collection: string;
  references: {
    [collection: string]: (TokenRef | ComponentSpecRef)[];
  };
}

export interface ReferenceGraph {
  [tokenRef: TokenRef]: ReferenceNode;
}

export interface SourceFile {
  fileName: string;
  ast: AST.TokensDocument | AST.TokenCollectionsDocument | AST.ComponentSpecDocument;
}

export interface RootageCtx {
  sourceFiles: SourceFile[];
  tokenIds: TokenRef[];
  tokenEntities: Record<TokenRef, AST.TokenDeclaration>;
  tokenCollectionIds: string[];
  tokenCollectionEntities: Record<string, AST.TokenCollectionDeclaration>;
  componentSpecIds: string[];
  componentSpecEntities: Record<string, AST.ComponentSpecDeclaration>;
  dependencyGraph: DependencyGraph;
  referenceGraph: ReferenceGraph;
}
