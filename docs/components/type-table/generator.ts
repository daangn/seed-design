import { createGenerator, type Generator } from "fumadocs-typescript";

const baseGenerator = createGenerator();

async function filteredGenerateDocumentation(
  ...args: Parameters<Generator["generateDocumentation"]>
): ReturnType<Generator["generateDocumentation"]> {
  const [file, name, options = {}] = args;

  const output = await baseGenerator.generateDocumentation(file, name, {
    ...options,
    transform(entry, type, symbol) {
      options.transform?.call(this, entry, type, symbol);
      const src = symbol.getDeclarations()?.[0].getSourceFile().getFilePath();
      if (src?.includes("node_modules")) {
        entry.tags.push({ name: "external", text: src ?? "" });
      }
    },
  });

  return output.map((item) => ({
    ...item,
    entries: item.entries
      .filter((e) => e.tags.every((t) => t.name !== "external"))
      .map((e) => ({
        ...e,
        // fumadocs-typescript's getSimpleForm resolves type aliases into their
        // full union members, making simplifiedType longer than type.
        // Use type (which preserves aliases via UseAliasDefinedOutsideCurrentScope)
        // for both collapsed and expanded views until upstream is fixed.
        // See: https://github.com/fuma-nama/fumadocs/packages/typescript/src/lib/get-simple-form.ts
        simplifiedType: e.type,
      })),
  }));
}

/**
 * Generator that filters out types originating from node_modules.
 *
 * This is the only reason SEED forked the type-table plugin from fumadocs.
 * By wrapping generateDocumentation, we can use fumadocs' remarkAutoTypeTable
 * directly while still excluding external types (e.g. React internal props).
 *
 * generateTypeTable calls `this.generateDocumentation` internally,
 * so we need a proper object with method references (not spread copy)
 * for `this` binding to work correctly.
 */
export const filteredTypeTableGenerator: Generator = {
  generateDocumentation: filteredGenerateDocumentation,
  generateTypeTable(props, options) {
    return baseGenerator.generateTypeTable.call(this, props, options);
  },
};
