import jscodeshift from "jscodeshift";
import fs from "fs";

export interface ImportTransformers {
  source: { find: string; replace?: string }[];
  identifier: { find: string; replace: string }[];
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

          return importTransformers.source.some(({ find }) => value.startsWith(find));
        },
      },
    }),
    importTransformers,
  });

  migrateIdentifiers({
    identifiers: tree.find(jscodeshift.Identifier, {
      name: (value) => importTransformers.identifier.some(({ find }) => value === find),
    }),
    identifierTransformers: importTransformers.identifier,
  });

  const firstNodeAfterModification = getFirstNode({ tree, jscodeshift: jscodeshift });

  if (firstNode !== firstNodeAfterModification) {
    firstNodeAfterModification.comments = firstNode.comments;
  }

  fs.writeFileSync(filePath, tree.toSource());
}

function getFirstNode({
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

      const sourceReplaced = importTransformers.source.reduce(
        (acc, { find, replace }) => acc.replace(find, replace),
        currentSourceValue,
      );

      const slashSplits = sourceReplaced.split("/");

      const itemReplaced = slashSplits
        .map((split, index) => {
          if (index !== slashSplits.length - 1) return split;

          return importTransformers.identifier.reduce(
            (acc, { find, replace }) => acc.replace(find, replace),
            split,
          );
        })
        .join("/");

      return itemReplaced;
    })();

    const newSpecifiers = currentSpecifiers.map((currentSpecifier) => {
      switch (currentSpecifier.type) {
        case "ImportSpecifier": {
          // import { IconHeart } from "some-package";
          const newImportedName = importTransformers.identifier.reduce(
            (acc, { find, replace }) => acc.replace(find, replace),
            currentSpecifier.imported.name,
          );

          const newImportedIdentifier = jscodeshift.identifier(newImportedName);

          const hasNoChange = newImportedName === currentSpecifier.imported.name;

          if (hasNoChange) return currentSpecifier;

          // TODO
          // impactedSpecifierCount++;

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

    const newName = identifierTransformers.reduce(
      (acc, { find, replace }) => acc.replace(find, replace),
      currentName,
    );

    return jscodeshift.identifier(newName);
  });
}
