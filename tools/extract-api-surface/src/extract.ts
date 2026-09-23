import { existsSync, readFileSync, realpathSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { binNames, findPublicPackages, resolveEntrypoints, type PublicPackage } from "./packages";
import { createSurfaceProgram } from "./program";

export interface Member {
  name: string;
  optional: boolean;
  type: string;
  /** Package that declares the member, when it is not the package being described. */
  declaredIn?: string;
  doc?: string;
}

/** Members inherited from a dependency outside the repo, counted instead of listed. */
export interface ExternalGroup {
  source: string;
  count: number;
}

export interface ExportSurface {
  name: string;
  kind: "alias" | "class" | "component" | "const" | "function" | "namespace" | "type";
  /** Type alias body, const type, aliased export name, or one entry per call signature. */
  signatures?: string[];
  doc?: string;
  members?: Member[];
  external?: ExternalGroup[];
  /** Own properties attached to a component or function value, such as `Item.Primitive`. */
  statics?: Member[];
}

export type EntrySurface =
  | { kind: "types"; subpath: string; exports: ExportSurface[] }
  | { kind: "asset"; subpath: string; targets: string[] }
  | { kind: "unresolved"; subpath: string; target: string };

export interface PackageSurface {
  name: string;
  bins: string[];
  entries: EntrySurface[];
}

export interface ExtractOptions {
  /** Only describe these packages. Every public package when omitted. */
  packages?: string[];
}

export function extractSurface(root: string, options: ExtractOptions = {}): PackageSurface[] {
  const publicPackages = findPublicPackages(root);
  const unknown = (options.packages ?? []).filter(
    (name) => !publicPackages.some((pkg) => pkg.name === name),
  );
  if (unknown.length > 0) throw new Error(`public 패키지가 아닙니다: ${unknown.join(", ")}`);

  const packages = publicPackages.filter(
    (pkg) => !options.packages || options.packages.includes(pkg.name),
  );
  const resolved = packages.map((pkg) => ({ pkg, entrypoints: resolveEntrypoints(pkg) }));

  const specifierPaths = Object.fromEntries(
    publicPackages.flatMap((pkg) =>
      resolveEntrypoints(pkg).flatMap((entry) =>
        entry.kind === "types" ? [[`${pkg.name}${entry.subpath.slice(1)}`, [entry.file]]] : [],
      ),
    ),
  );
  const entryFiles = resolved.flatMap(({ entrypoints }) =>
    entrypoints.flatMap((entry) => (entry.kind === "types" ? [entry.file] : [])),
  );
  const { program, unresolved } = createSurfaceProgram({
    root,
    packageDirs: publicPackages.map((pkg) => pkg.dir),
    entryFiles,
    specifierPaths,
  });
  if (unresolved.length > 0) {
    const listed = unresolved
      .slice(0, 20)
      .map(({ specifier, file }) => `  ${specifier}  (${path.relative(root, file)})`);
    const install = existsSync(path.join(root, "node_modules"))
      ? []
      : [
          "",
          `${root}에 node_modules가 없습니다. 먼저 \`bun install --cwd ${root}\`를 실행해 주세요.`,
        ];

    throw new Error(
      [
        `해석하지 못한 import가 ${unresolved.length}개 있어 표면을 정확히 추출할 수 없습니다.`,
        ...listed,
        ...(unresolved.length > listed.length
          ? [`  … 외 ${unresolved.length - listed.length}개`]
          : []),
        ...install,
      ].join("\n"),
    );
  }

  const describer = createDescriber(program);

  return resolved.map(({ pkg, entrypoints }) => ({
    name: pkg.name,
    bins: binNames(pkg.manifest),
    entries: entrypoints.map((entry): EntrySurface => {
      if (entry.kind !== "types") return entry;

      return {
        kind: "types",
        subpath: entry.subpath,
        exports: describer.describeFile(entry.file, pkg),
      };
    }),
  }));
}

function createDescriber(program: ts.Program) {
  const checker = program.getTypeChecker();
  const printer = ts.createPrinter({ removeComments: true, omitTrailingSemicolon: true });
  const printFile = ts.createSourceFile("surface.ts", "", ts.ScriptTarget.Latest);
  const owners = new Map<string, string | undefined>();

  const NODE_FLAGS =
    ts.NodeBuilderFlags.NoTruncation |
    ts.NodeBuilderFlags.UseAliasDefinedOutsideCurrentScope |
    ts.NodeBuilderFlags.IgnoreErrors;

  const print = (node: ts.Node) =>
    printer.printNode(ts.EmitHint.Unspecified, node, printFile).replace(/\s+/g, " ");

  /**
   * Union members print in type-creation order, which differs between two programs over the
   * same code, so they are sorted before printing.
   */
  function printNormalized(node: ts.Node | undefined) {
    if (!node) return "unknown";

    const [normalized] = ts.transform(node, [
      (context) => (rootNode) => {
        const visit = (child: ts.Node): ts.Node => {
          const visited = ts.visitEachChild(child, visit, context);
          if (!ts.isUnionTypeNode(visited)) return visited;

          const sorted = [...visited.types].sort((a, b) => print(a).localeCompare(print(b)));

          return context.factory.updateUnionTypeNode(
            visited,
            context.factory.createNodeArray(sorted),
          );
        };

        return ts.visitNode(rootNode, visit) ?? rootNode;
      },
    ]).transformed;

    return print(normalized ?? node);
  }

  const printType = (type: ts.Type, at: ts.Node, extraFlags = ts.NodeBuilderFlags.None) =>
    printNormalized(checker.typeToTypeNode(type, at, NODE_FLAGS | extraFlags));

  const printSignature = (signature: ts.Signature, at: ts.Node) =>
    printNormalized(
      checker.signatureToSignatureDeclaration(
        signature,
        ts.SyntaxKind.FunctionType,
        at,
        NODE_FLAGS,
      ),
    );

  const realPaths = new Map<string, string>();
  function realPathOf(declaration: ts.Declaration) {
    const { fileName } = declaration.getSourceFile();
    const cached = realPaths.get(fileName);
    if (cached) return cached;

    const real = realpathSync(fileName);
    realPaths.set(fileName, real);

    return real;
  }

  /** Nearest package name for a declaration; `undefined` for code outside the repo. */
  function ownerOf(declaration: ts.Declaration) {
    const real = realPathOf(declaration);
    if (real.split(path.sep).includes("node_modules")) return;

    let dir = path.dirname(real);
    while (dir !== path.dirname(dir)) {
      if (!owners.has(dir)) {
        const manifest = path.join(dir, "package.json");
        owners.set(
          dir,
          existsSync(manifest)
            ? (JSON.parse(readFileSync(manifest, "utf8")).name ?? undefined)
            : undefined,
        );
      }

      const owner = owners.get(dir);
      if (owner) return owner;

      dir = path.dirname(dir);
    }
  }

  function externalSource(declaration: ts.Declaration) {
    const file = realPathOf(declaration).split(path.sep);
    const modules = file.lastIndexOf("node_modules");
    const scoped = file[modules + 1]?.startsWith("@");

    return file.slice(modules + 1, modules + (scoped ? 3 : 2)).join("/");
  }

  /**
   * Mapped-type members, such as Lynx's `main-thread:*` event props, carry no declaration of
   * their own; the part of the type that contributes them does.
   */
  function originOf(type: ts.Type, name: string): ts.Declaration | undefined {
    for (const part of type.isUnionOrIntersection() ? type.types : [type]) {
      if (!checker.getPropertyOfType(part, name)) continue;

      const found =
        part !== type && part.isUnionOrIntersection()
          ? originOf(part, name)
          : (part.aliasSymbol ?? part.symbol)?.getDeclarations()?.[0];
      if (found) return found;
    }
  }

  function docOf(symbol: ts.Symbol) {
    const text = ts
      .displayPartsToString(symbol.getDocumentationComment(checker))
      .replace(/\s+/g, " ")
      .trim();
    const tags = symbol
      .getJsDocTags(checker)
      .filter((tag) => tag.name === "default" || tag.name === "deprecated")
      .map((tag) => {
        const value = ts.displayPartsToString(tag.text).replace(/\s+/g, " ").trim();

        return value ? `@${tag.name} ${value}` : `@${tag.name}`;
      });
    const doc = [text, ...tags].filter(Boolean).join(" ");

    return doc || undefined;
  }

  function describeMembers(type: ts.Type, at: ts.Node, pkg: PublicPackage) {
    const members: Member[] = [];
    const external = new Map<string, number>();

    for (const property of checker.getPropertiesOfType(type)) {
      const [declaration] = property.getDeclarations() ?? [];
      const origin = declaration ?? originOf(type, property.name);
      const owner = origin && ownerOf(origin);

      if (origin && !owner) {
        const source = externalSource(origin);
        external.set(source, (external.get(source) ?? 0) + 1);
        continue;
      }

      const doc = docOf(property);
      members.push({
        name: property.name,
        optional: (property.flags & ts.SymbolFlags.Optional) !== 0,
        type: printType(
          checker.getTypeOfSymbolAtLocation(property, declaration ?? at),
          declaration ?? at,
        ),
        ...(owner && owner !== pkg.name && { declaredIn: owner }),
        ...(doc && { doc }),
      });
    }

    return {
      members: members.sort((a, b) => a.name.localeCompare(b.name)),
      external: [...external]
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => a.source.localeCompare(b.source)),
    };
  }

  /**
   * `seen` maps each symbol already described in the entrypoint to its export name, so a second
   * name for it (`SidePanelBody` next to `SidePanel.Body`) is recorded as an alias instead of
   * repeating every member.
   */
  function describeSymbol(
    name: string,
    exported: ts.Symbol,
    pkg: PublicPackage,
    seen: Map<ts.Symbol, string>,
  ): ExportSurface[] {
    const symbol =
      exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
    const [declaration] = symbol.getDeclarations() ?? [];
    if (!declaration) return [{ name, kind: "const", signatures: ["unknown"] }];

    const original = seen.get(symbol);
    if (original) return [{ name, kind: "alias", signatures: [original] }];

    seen.set(symbol, name);

    const doc = docOf(symbol);
    const surfaces: ExportSurface[] = [];

    // A function with assigned properties (`Foo.displayName = …`) also gets namespace flags;
    // only a module or a `namespace` block is described as one.
    const isNamespace = symbol
      .getDeclarations()
      ?.some((node) => ts.isSourceFile(node) || ts.isModuleDeclaration(node));

    if (isNamespace) {
      surfaces.push(
        { name, kind: "namespace" },
        ...sortByName(checker.getExportsOfModule(symbol)).flatMap((member) =>
          describeSymbol(`${name}.${member.name}`, member, pkg, seen),
        ),
      );
    }

    if (
      symbol.flags &
      (ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias | ts.SymbolFlags.Enum)
    ) {
      const type = checker.getDeclaredTypeOfSymbol(symbol);
      const parameters =
        ts.isInterfaceDeclaration(declaration) || ts.isTypeAliasDeclaration(declaration)
          ? (declaration.typeParameters ?? [])
          : [];
      const typeName =
        parameters.length > 0 ? `${name}<${parameters.map(print).join(", ")}>` : name;
      const isObject =
        !(symbol.flags & ts.SymbolFlags.Enum) &&
        !type.isUnion() &&
        (type.flags & ts.TypeFlags.Object || type.isIntersection());

      surfaces.push(
        isObject
          ? {
              name: typeName,
              kind: "type",
              ...(doc && { doc }),
              ...describeMembers(type, declaration, pkg),
            }
          : {
              name: typeName,
              kind: "type",
              signatures: [printType(type, declaration, ts.NodeBuilderFlags.InTypeAlias)],
              ...(doc && { doc }),
            },
      );
    }

    if (symbol.flags & ts.SymbolFlags.Class) {
      surfaces.push({
        name,
        kind: "class",
        ...(doc && { doc }),
        ...describeMembers(checker.getDeclaredTypeOfSymbol(symbol), declaration, pkg),
      });
    } else if (symbol.flags & (ts.SymbolFlags.Function | ts.SymbolFlags.Variable)) {
      surfaces.push(describeValue(name, symbol, declaration, pkg, doc));
    }

    return surfaces;
  }

  function describeValue(
    name: string,
    symbol: ts.Symbol,
    declaration: ts.Declaration,
    pkg: PublicPackage,
    doc: string | undefined,
  ): ExportSurface {
    const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
    const signatures = type.getCallSignatures();
    const statics = describeMembers(type, declaration, pkg).members;

    const [first] = signatures;
    const [propsParameter] = first?.getParameters() ?? [];
    const propsType =
      propsParameter && checker.getTypeOfSymbolAtLocation(propsParameter, declaration);
    const lastSegment = name.slice(name.lastIndexOf(".") + 1);

    if (
      propsType &&
      /^[A-Z]/.test(lastSegment) &&
      checker.getPropertiesOfType(propsType).length > 0
    ) {
      return {
        name,
        kind: "component",
        ...(doc && { doc }),
        ...describeMembers(propsType, declaration, pkg),
        ...(statics.length > 0 && { statics }),
      };
    }

    if (signatures.length > 0) {
      return {
        name,
        kind: "function",
        signatures: signatures.map((signature) => printSignature(signature, declaration)),
        ...(doc && { doc }),
        ...(statics.length > 0 && { statics }),
      };
    }

    return { name, kind: "const", signatures: [printType(type, declaration)], ...(doc && { doc }) };
  }

  function describeFile(file: string, pkg: PublicPackage) {
    const sourceFile = program.getSourceFile(file);
    const moduleSymbol = sourceFile && checker.getSymbolAtLocation(sourceFile);
    if (!moduleSymbol) return [];

    const seen = new Map<ts.Symbol, string>();

    return sortByName(checker.getExportsOfModule(moduleSymbol))
      .flatMap((symbol) => describeSymbol(symbol.name, symbol, pkg, seen))
      .sort((a, b) => a.name.localeCompare(b.name) || a.kind.localeCompare(b.kind));
  }

  return { describeFile };
}

const sortByName = (symbols: ts.Symbol[]) =>
  [...symbols].sort((a, b) => a.name.localeCompare(b.name));
