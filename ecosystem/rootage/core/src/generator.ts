import type { TokenDeclaration, TokenCollectionDeclaration } from "./parser/ast";

/**
 * Generator function signature for creating output from design tokens
 */
export type GeneratorFunction = (
  ast: {
    tokens: TokenDeclaration[];
    tokenCollections: TokenCollectionDeclaration[];
  },
  options: Record<string, any>
) => string | Promise<string>;

/**
 * Generator module can export either:
 * - A default function
 * - A named 'generate' function  
 * - A named 'getTokenCss' function (for backwards compatibility)
 */
export interface GeneratorModule {
  default?: GeneratorFunction;
  generate?: GeneratorFunction;
  getTokenCss?: GeneratorFunction;
  [key: string]: any;
}

/**
 * Load and execute a generator
 */
export async function runGenerator(
  generatorPath: string,
  ast: {
    tokens: TokenDeclaration[];
    tokenCollections: TokenCollectionDeclaration[];
  },
  options: Record<string, any>
): Promise<string> {
  let module: GeneratorModule;
  
  try {
    // Convert relative paths to absolute paths
    const absolutePath = generatorPath.startsWith('.')
      ? new URL(generatorPath, `file://${process.cwd()}/`).pathname
      : generatorPath;
    
    // Dynamic import
    module = await import(absolutePath);
  } catch (error) {
    throw new Error(`Failed to load generator from ${generatorPath}: ${error.message}`);
  }

  // Find the generator function
  const generator = 
    typeof module.default === 'function' ? module.default :
    typeof module.generate === 'function' ? module.generate :
    typeof module.getTokenCss === 'function' ? module.getTokenCss :
    null;
    
  if (!generator) {
    throw new Error(
      `Generator module must export a function (default, generate, or getTokenCss)`
    );
  }
  
  // Execute the generator
  const result = await generator(ast, options);
  
  if (typeof result !== 'string') {
    throw new Error('Generator must return a string');
  }
  
  return result;
}