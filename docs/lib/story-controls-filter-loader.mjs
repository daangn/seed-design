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

      const resolved = getAllowedPropNames(ctx, options);
      if (!resolved) continue;
      const { allowed, defaults } = resolved;

      const generatedObj = options
        .getProperty("_generated")
        ?.asKind(SyntaxKind.PropertyAssignment)
        ?.getInitializer()
        ?.asKind(SyntaxKind.ObjectLiteralExpression);
      const controlsLiteral = generatedObj
        ?.getProperty("controls")
        ?.asKind(SyntaxKind.PropertyAssignment)
        ?.getInitializer()
        ?.asKind(SyntaxKind.StringLiteral);
      if (!generatedObj || !controlsLiteral) continue;

      const node = parse(controlsLiteral.getLiteralValue());
      if (node?.type !== "object") continue;

      node.properties = node.properties.filter((property) => allowed.has(property.name));
      // JSON.stringify for correct escaping — setLiteralValue mangles backslashes
      controlsLiteral.replaceWithText(JSON.stringify(stringify(node)));
      changed = true;

      // Seed the story's initial data with each prop's `@default` (from JSDoc, read
      // in getAllowedPropNames) so controls reflect the component's real defaults —
      // e.g. a Chip Radio / Switch preselects the actual default instead of the
      // first member. Scoped to props that survived the filter; `initial`/`fixed`
      // still override these in factory.getProps.
      const scopedDefaults = Object.fromEntries(
        node.properties
          .filter((property) => property.name in defaults)
          .map((property) => [property.name, defaults[property.name]]),
      );
      if (Object.keys(scopedDefaults).length > 0 && !generatedObj.getProperty("defaults")) {
        generatedObj.addPropertyAssignment({
          name: "defaults",
          initializer: JSON.stringify(JSON.stringify(scopedDefaults)),
        });
      }
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
  const defaults = {};
  for (const property of propsParam.getTypeAtLocation(componentExpr).getProperties()) {
    const name = property.getName();

    // intersections merge symbols, so a prop redeclared in the repo (e.g. an
    // inline `& { children?: string }`) carries the node_modules declaration
    // too — drop only when every declaration is external
    const sources = (property.getDeclarations() ?? []).map((declaration) =>
      declaration.getSourceFile().getFilePath(),
    );
    // `children` is React-declared (node_modules) but it's the component's
    // content, not an HTML/aria attribute — always keep it so it renders as a
    // control (ReplaceReactNode gives it a string widget). This removes the need
    // for a per-story `withStoryPreview<{ children?: string }>()` override.
    if (
      name !== "children" &&
      sources.length > 0 &&
      sources.every((src) => src.includes("node_modules"))
    )
      continue;

    allowed.add(name);
    const defaultValue = readDefault(property);
    if (defaultValue !== undefined) defaults[name] = defaultValue;
    // re-run the loader when in-repo prop declarations change
    for (const src of sources) {
      if (!src.includes("node_modules")) ctx.addDependency(src);
    }
  }

  return { allowed, defaults };
}

/**
 * Reads a prop's `@default` JSDoc tag and parses it into a primitive. SEED recipe
 * types tag their variants (e.g. `@default "medium"`, `@default false`), and the
 * tag lives on the workspace declaration reachable from the resolved prop symbol.
 * Only JSON primitives (string/number/boolean) are returned; anything else
 * (functions, objects, unparseable text) is skipped so nothing garbage is seeded.
 */
function readDefault(property) {
  for (const declaration of property.getDeclarations() ?? []) {
    if (typeof declaration.getJsDocs !== "function") continue;

    for (const doc of declaration.getJsDocs()) {
      for (const tag of doc.getTags()) {
        if (tag.getTagName() !== "default") continue;

        const text = tag.getCommentText()?.trim();
        if (!text) return undefined;

        try {
          const value = JSON.parse(text);
          const type = typeof value;
          if (type === "string" || type === "number" || type === "boolean") return value;
        } catch {}

        return undefined;
      }
    }
  }

  return undefined;
}
