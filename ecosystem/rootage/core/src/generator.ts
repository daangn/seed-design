import type { TokenDeclaration, TokenCollectionDeclaration } from "./parser/ast";

/**
 * Common options for all generators
 */
export interface GeneratorOptions {
  /** Optional prefix for generated tokens */
  prefix?: string;
}

/**
 * Generator function signature for creating output from design tokens
 */
export type GeneratorFunction = (
  ast: {
    tokens: TokenDeclaration[];
    tokenCollections: TokenCollectionDeclaration[];
  },
  options: GeneratorOptions,
) => string | Promise<string>;

/**
 * Execute a generator and check that it returned a string
 */
export async function runGenerator(
  generator: GeneratorFunction,
  ast: Parameters<GeneratorFunction>[0],
  options: GeneratorOptions,
): Promise<string> {
  const result: unknown = await generator(ast, options);

  if (typeof result !== "string") {
    throw new Error("Generator must return a string");
  }

  return result;
}
