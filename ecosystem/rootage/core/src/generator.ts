import type {
  ComponentSpecDeclaration,
  TokenCollectionDeclaration,
  TokenDeclaration,
  TokenLit,
  ValueLit,
} from "./parser/ast";

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

export interface ComponentSpecGeneratorOptions extends GeneratorOptions {
  /** Resolves a token reference to one value per collection mode, in the collection's mode order. */
  resolveTokenValues: (token: TokenLit) => ValueLit[] | undefined;
}

/** A generated file, with its path relative to the output directory. */
export interface GeneratedFile {
  path: string;
  code: string;
}

/**
 * Generator function signature for creating component spec files
 */
export type ComponentSpecGeneratorFunction = (
  ast: { componentSpecs: ComponentSpecDeclaration[] },
  options: ComponentSpecGeneratorOptions,
) => GeneratedFile[] | Promise<GeneratedFile[]>;

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

/**
 * Execute a component spec generator and check that it returned files
 */
export async function runComponentSpecGenerator(
  generator: ComponentSpecGeneratorFunction,
  ast: Parameters<ComponentSpecGeneratorFunction>[0],
  options: ComponentSpecGeneratorOptions,
): Promise<GeneratedFile[]> {
  const result: unknown = await generator(ast, options);

  const isFileList =
    Array.isArray(result) &&
    result.every(
      (file) =>
        typeof file === "object" &&
        file !== null &&
        typeof file.path === "string" &&
        typeof file.code === "string",
    );

  if (!isFileList) {
    throw new Error("Component spec generator must return an array of { path, code }");
  }

  return result;
}
