import jscodeshift from "jscodeshift";
import fs from "fs";

export interface ImportTransformers {
  source: { startsWith: string; replaceWith?: string }[];
  identifier: Record<string, string>;
}

interface MigrateFileParams {
  filePath: string;
  jscodeshift: jscodeshift.JSCodeshift;
  importTransformers: ImportTransformers;
}

export function migrateFile({ filePath, jscodeshift, importTransformers }: MigrateFileParams) {
  const file = fs.readFileSync(filePath, "utf-8");

  const tree = jscodeshift(file);
  const firstNode = getFirstNode({ tree, jscodeshift: jscodeshift });

  migrateImportDeclarations({
    importDeclarations: tree.find(jscodeshift.ImportDeclaration, {
      source: {
        value: (value: unknown) => {
          if (typeof value !== "string") return false;

          return importTransformers.source.some(({ startsWith }) => value.startsWith(startsWith));
        },
      },
    }),
    importTransformers,
  });

  migrateIdentifiers({
    identifiers: tree.find(jscodeshift.Identifier, {
      name: (value) => Object.keys(importTransformers.identifier).includes(value),
    }),
    identifierTransformers: importTransformers.identifier,
  });

  const firstNodeAfterModification = getFirstNode({ tree, jscodeshift: jscodeshift });

  if (firstNode !== firstNodeAfterModification) {
    firstNodeAfterModification.comments = firstNode.comments;
  }

  fs.writeFileSync(filePath, tree.toSource());
}

export function getFirstNode({
  tree,
  jscodeshift,
}: { tree: jscodeshift.Collection; jscodeshift: jscodeshift.JSCodeshift }) {
  return tree.find(jscodeshift.Program).get("body", 0).node;
}

interface MigrateImportDeclarationsParams {
  importDeclarations: jscodeshift.Collection<jscodeshift.ImportDeclaration>;
  importTransformers: ImportTransformers;
}

export function migrateImportDeclarations({
  importDeclarations,
  importTransformers,
}: MigrateImportDeclarationsParams) {
  importDeclarations.replaceWith((imp) => {
    const currentSourceValue = imp.node.source.value;
    const currentSpecifiers = imp.node.specifiers;
    const currentImportKind = imp.node.importKind;

    const newSourceValue = (() => {
      if (typeof currentSourceValue !== "string") return currentSourceValue;

      console.log(importTransformers.source);

      const { startsWith, replaceWith } = importTransformers.source.find(({ startsWith }) =>
        currentSourceValue.startsWith(startsWith),
      );

      const sourceReplaced = replaceWith
        ? currentSourceValue.replace(startsWith, replaceWith)
        : currentSourceValue;

      const slashSplits = sourceReplaced.split("/");

      const itemReplaced = slashSplits
        .map((split, index) => {
          if (index !== slashSplits.length - 1 || split in importTransformers.identifier === false)
            return split;

          return importTransformers.identifier[split];
        })
        .join("/");

      return itemReplaced;
    })();

    const newSpecifiers = currentSpecifiers.map((currentSpecifier) => {
      switch (currentSpecifier.type) {
        case "ImportSpecifier": {
          // import { IconHeart } from "some-package";
          const currentImportedName = currentSpecifier.imported.name;

          if (currentImportedName in importTransformers.identifier === false)
            return currentSpecifier;

          const newImportedName = importTransformers.identifier[currentImportedName];

          const hasNoChange = newImportedName === currentImportedName;

          if (hasNoChange) return currentSpecifier;

          // TODO
          // impactedSpecifierCount++;
          const newImportedIdentifier = jscodeshift.identifier(newImportedName);

          // import { IconHeart as Heart } from "some-package"; 에서
          // imported: "IconHeart", local: "Heart"
          return jscodeshift.importSpecifier(newImportedIdentifier, currentSpecifier.local);
        }
        case "ImportDefaultSpecifier": {
          // import Icon from "some-package";
          return currentSpecifier;
        }
        case "ImportNamespaceSpecifier": {
          // import * as Icon from "some-package";
          return currentSpecifier;
        }
      }
    });

    const newImportDeclaration = jscodeshift.importDeclaration(
      newSpecifiers,
      jscodeshift.literal(newSourceValue),
      currentImportKind,
    );

    return newImportDeclaration;
  });
}

interface MigrateIdentifiersParams {
  identifiers: jscodeshift.Collection<jscodeshift.Identifier>;
  identifierTransformers: ImportTransformers["identifier"];
}

export function migrateIdentifiers({
  identifiers,
  identifierTransformers,
}: MigrateIdentifiersParams) {
  identifiers.replaceWith((identifier) => {
    const currentName = identifier.node.name;

    if (currentName in identifierTransformers === false) return identifier;

    return jscodeshift.identifier(identifierTransformers[currentName]);
  });
}
