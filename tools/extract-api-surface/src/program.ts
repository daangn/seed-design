import { existsSync, realpathSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

const BASE_OPTIONS: ts.CompilerOptions = {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  lib: ["lib.esnext.d.ts", "lib.dom.d.ts", "lib.dom.iterable.d.ts"],
  strict: true,
  skipLibCheck: true,
  resolveJsonModule: true,
  noEmit: true,
};

/**
 * One program over every entrypoint. `specifierPaths` sends `@seed-design/*` imports to source,
 * and each workspace package additionally resolves its own tsconfig `paths` (`@/*` in
 * packages/figma), which a single program-wide option could not express.
 */
export function createSurfaceProgram({
  root,
  packageDirs,
  entryFiles,
  specifierPaths,
}: {
  root: string;
  /** Workspace packages whose tsconfig-included ambient declarations the program needs. */
  packageDirs: string[];
  entryFiles: string[];
  specifierPaths: Record<string, string[]>;
}) {
  // Pinned to the extracted root, so a checkout nested in another one never borrows its types.
  const options = {
    ...BASE_OPTIONS,
    paths: specifierPaths,
    typeRoots: [path.join(root, "node_modules", "@types")],
  };
  const host = ts.createCompilerHost(options);
  const owningDirs = new Map<string, string | undefined>();
  const configs = new Map<string, ts.ParsedCommandLine | undefined>();
  const packageOptions = new Map<string, ts.CompilerOptions>();

  function packageDirOf(file: string): string | undefined {
    const dir = path.dirname(file);
    if (owningDirs.has(dir)) return owningDirs.get(dir);

    const found =
      dir.split(path.sep).includes("node_modules") || path.relative(root, dir).startsWith("..")
        ? undefined
        : existsSync(path.join(dir, "package.json"))
          ? dir
          : dir === root
            ? undefined
            : packageDirOf(dir);
    owningDirs.set(dir, found);

    return found;
  }

  function configOf(dir: string) {
    if (configs.has(dir)) return configs.get(dir);

    const configPath = path.join(dir, "tsconfig.json");
    const config = existsSync(configPath)
      ? ts.parseJsonConfigFileContent(
          ts.readConfigFile(configPath, ts.sys.readFile).config,
          ts.sys,
          dir,
        )
      : undefined;
    configs.set(dir, config);

    return config;
  }

  function optionsFor(file: string) {
    const dir = packageDirOf(file);
    if (!dir) return options;

    const cached = packageOptions.get(dir);
    if (cached) return cached;

    const own = configOf(dir)?.options ?? {};
    const resolved = own.paths
      ? {
          ...options,
          ...(own.baseUrl && { baseUrl: own.baseUrl }),
          pathsBasePath: own.pathsBasePath,
          paths: { ...specifierPaths, ...own.paths },
        }
      : options;
    packageOptions.set(dir, resolved);

    return resolved;
  }

  const failures: Array<{ literal: ts.StringLiteralLike; file: string }> = [];
  host.resolveModuleNameLiterals = (
    literals,
    containingFile,
    redirected,
    _,
    containingSourceFile,
  ) => {
    const fileOptions = optionsFor(containingFile);
    const inRepo = !realpathSync(containingFile).split(path.sep).includes("node_modules");

    return literals.map((literal) => {
      const result = ts.resolveModuleName(
        literal.text,
        containingFile,
        fileOptions,
        host,
        undefined,
        redirected,
        ts.getModeForUsageLocation(containingSourceFile, literal, fileOptions),
      );
      // A negative position marks an import TypeScript synthesized, such as `react/jsx-runtime`.
      if (!result.resolvedModule && inRepo && literal.pos >= 0)
        failures.push({ literal, file: containingFile });

      return result;
    });
  };

  // Ambient declarations such as `declare module "*.webp"` are included by tsconfig, never imported.
  const ambientFiles = packageDirs.flatMap(
    (dir) => configOf(dir)?.fileNames.filter((file) => file.endsWith(".d.ts")) ?? [],
  );
  const program = ts.createProgram({ rootNames: [...entryFiles, ...ambientFiles], options, host });
  const checker = program.getTypeChecker();

  return {
    program,
    /**
     * Imports in repo source that resolve to nothing, minus modules declared with
     * `declare module`. Anything flowing from them silently degrades to `any`.
     */
    unresolved: failures
      .filter(({ literal }) => !checker.getSymbolAtLocation(literal))
      .map(({ literal, file }) => ({ specifier: literal.text, file })),
  };
}
