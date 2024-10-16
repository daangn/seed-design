import jscodeshift from "jscodeshift";
import type { MigrateIconsOptions } from "../migrate-icons";

interface MigrateImportDeclarationsParams {
  importDeclarations: jscodeshift.Collection<jscodeshift.ImportDeclaration>;
  options: MigrateIconsOptions;
}

export function migrateImportDeclarations({
  importDeclarations,
  options,
}: MigrateImportDeclarationsParams) {
  importDeclarations.replaceWith((imp) => {
    const currentSourceValue = imp.node.source.value;
    const currentSpecifiers = imp.node.specifiers;
    const currentImportKind = imp.node.importKind;

    const newSourceValue = (() => {
      if (typeof currentSourceValue !== "string") return currentSourceValue;

      const { startsWith, replaceWith } = options.source.find(({ startsWith }) =>
        currentSourceValue.startsWith(startsWith),
      );

      const sourceReplaced = replaceWith
        ? currentSourceValue.replace(startsWith, replaceWith)
        : currentSourceValue;

      const slashSplits = sourceReplaced.split("/");

      // @seed-design/icon -> @seed-design/react-icon
      // @seed-design/icon/IconSomething -> @seed-design/react-icon/IconSomething
      // @seed-design/icon/lib/IconSomething -> @seed-design/react-icon/lib/IconSomething
      const itemReplaced = slashSplits
        .map((split, index) => {
          if (index !== slashSplits.length - 1 || split in options.identifier === false)
            return split;

          return options.identifier[split];
        })
        .join("/");

      return itemReplaced;
    })();

    // import { a, b, c } from "some-package";
    // a, b, c 각각 ImportSpecifier
    // imported name: a, b, c, local name: a, b, c

    // import { a as A, b as B, c as C } from "some-package";
    // a as A, b as B, c as C 각각 ImportSpecifier
    // imported name: a, b, c, local name: A, B, C

    // import A from "some-package";
    // A는 ImportDefaultSpecifier

    // import * as A from "some-package";
    // * as A는 ImportNamespaceSpecifier
    // A는 local name

    const newSpecifiers = currentSpecifiers.map((currentSpecifier) => {
      switch (currentSpecifier.type) {
        case "ImportSpecifier": {
          const currentImportedName = currentSpecifier.imported.name;

          if (currentImportedName in options.identifier === false) return currentSpecifier;

          const newImportedName = options.identifier[currentImportedName];

          const hasNoChange = newImportedName === currentImportedName;

          if (hasNoChange) return currentSpecifier;

          // TODO
          // impactedSpecifierCount++;

          const newImportedIdentifier = jscodeshift.identifier(newImportedName);

          // local name 유지하는 이유:
          // import 밑에서 사용되는 실제 변수명은 migrateImportDeclaration에서 다루지 않으므로 바꾸면 곤란
          return jscodeshift.importSpecifier(newImportedIdentifier, currentSpecifier.local);
        }
        case "ImportDefaultSpecifier": {
          // import name 없으니 자연스럽게 local name 유지
          return currentSpecifier;
        }
        case "ImportNamespaceSpecifier": {
          // import name 없으니 자연스럽게 local name 유지
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
  options: MigrateIconsOptions["identifier"];
}

export function migrateIdentifiers({ identifiers, options }: MigrateIdentifiersParams) {
  identifiers.replaceWith((identifier) => {
    const currentName = identifier.node.name;

    if (currentName in options === false) return identifier;

    return jscodeshift.identifier(options[currentName]);
  });
}
