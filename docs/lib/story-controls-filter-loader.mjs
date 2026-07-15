import path from "node:path";
import { parse, stringify } from "@ungap/structured-clone/json";
import { Node, Project, SyntaxKind } from "ts-morph";

let project;

/**
 * Runs after `@fumadocs/story/webpack/story` (webpack applies loaders
 * right-to-left) and filters the generated `_generated.controls` the same way
 * react-type-table does (components/type-table/generator.ts): props whose
 * declaration lives in node_modules are dropped, so HTML/aria attributes never
 * show up as story controls. Workspace packages resolve to their real path
 * outside node_modules, so SEED-declared props survive.
 */
export default function storyControlsFilterLoader(source) {
  const callback = this.async();
  this.cacheable(true);

  try {
    callback(undefined, filterControls(this, source) ?? source);
  } catch (error) {
    callback(error);
  }
}

function filterControls(ctx, source) {
  if (!source.includes("_generated")) return;

  project ??= new Project({
    tsConfigFilePath: path.join(ctx.rootContext, "tsconfig.json"),
    skipAddingFilesFromTsConfig: true,
  });
  const sourceFile = project.createSourceFile(ctx.resourcePath, source, { overwrite: true });

  let changed = false;
  for (const declarations of sourceFile.getExportedDeclarations().values()) {
    for (const declaration of declarations) {
      if (!Node.isVariableDeclaration(declaration)) continue;

      const call = declaration.getInitializer();
      if (!call?.isKind(SyntaxKind.CallExpression)) continue;

      const callee = call.getExpression().getText();
      if (callee !== "defineStory" && !callee.endsWith(".defineStory")) continue;

      const options = call.getArguments()[0]?.asKind(SyntaxKind.ObjectLiteralExpression);
      if (!options) continue;

      const allowed = getAllowedPropNames(ctx, options);
      if (!allowed) continue;

      const controlsLiteral = options
        .getProperty("_generated")
        ?.asKind(SyntaxKind.PropertyAssignment)
        ?.getInitializer()
        ?.asKind(SyntaxKind.ObjectLiteralExpression)
        ?.getProperty("controls")
        ?.asKind(SyntaxKind.PropertyAssignment)
        ?.getInitializer()
        ?.asKind(SyntaxKind.StringLiteral);
      if (!controlsLiteral) continue;

      const node = parse(controlsLiteral.getLiteralValue());
      if (node?.type !== "object") continue;

      node.properties = node.properties.filter((property) => allowed.has(property.name));
      // JSON.stringify for correct escaping — setLiteralValue mangles backslashes
      controlsLiteral.replaceWithText(JSON.stringify(stringify(node)));
      changed = true;
    }
  }

  if (!changed) return;

  return sourceFile.getFullText();
}

function getAllowedPropNames(ctx, options) {
  const componentProp = options.getProperty("Component");
  const componentExpr = componentProp?.isKind(SyntaxKind.PropertyAssignment)
    ? componentProp.getInitializer()
    : componentProp?.isKind(SyntaxKind.ShorthandPropertyAssignment)
      ? componentProp.getNameNode()
      : undefined;
  if (!componentExpr) return;

  const [signature] = componentExpr.getType().getCallSignatures();
  const [propsParam] = signature?.getParameters() ?? [];
  if (!propsParam) return;

  const allowed = new Set();
  for (const property of propsParam.getTypeAtLocation(componentExpr).getProperties()) {
    // intersections merge symbols, so a prop redeclared in the repo (e.g. an
    // inline `& { children?: string }`) carries the node_modules declaration
    // too — drop only when every declaration is external
    const sources = (property.getDeclarations() ?? []).map((declaration) =>
      declaration.getSourceFile().getFilePath(),
    );
    if (sources.length > 0 && sources.every((src) => src.includes("node_modules"))) continue;

    allowed.add(property.getName());
    // re-run the loader when in-repo prop declarations change
    for (const src of sources) {
      if (!src.includes("node_modules")) ctx.addDependency(src);
    }
  }

  return allowed;
}
