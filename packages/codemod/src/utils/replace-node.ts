import jscodeshift from "jscodeshift";
import type { MigrateIconsOptions } from "../transforms/migrate-icons.js";
import type { Logger } from "winston";
import { LOG_PREFIX } from "./log.js";

interface MigrateImportDeclarationsParams {
  importDeclarations: jscodeshift.Collection<jscodeshift.ImportDeclaration>;
  match: MigrateIconsOptions["match"];
  logger?: Logger;
  filePath: jscodeshift.FileInfo["path"];
}

export function migrateImportDeclarations({
  importDeclarations,
  match,
  logger,
  filePath,
}: MigrateImportDeclarationsParams) {
  importDeclarations.replaceWith((imp) => {
    const currentSourceValue = imp.node.source.value;
    const currentSpecifiers = imp.node.specifiers;
    const currentImportKind = imp.node.importKind;
    const currentComments = imp.node.comments;

    const newSourceValue = (() => {
      if (typeof currentSourceValue !== "string") return currentSourceValue;

      const { startsWith, replaceWith } = match.source.find(({ startsWith }) =>
        currentSourceValue.startsWith(startsWith),
      );

      const sourceReplaced = replaceWith
        ? currentSourceValue.replace(startsWith, replaceWith)
        : currentSourceValue;

      const slashSplits = sourceReplaced.split("/");

      // @seed-design/icon -> @seed-design/react-icon
      // @seed-design/icon/IconSomething -> @seed-design/react-icon/IconSomething
      // @seed-design/icon/lib/IconSomething -> @seed-design/react-icon/lib/IconSomething
      const result = slashSplits
        .map((split, index) => {
          if (index !== slashSplits.length - 1 || split in match.identifier === false) return split;

          return match.identifier[split].newName;
        })
        .join("/");

      return result;
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

    logger?.debug(`${filePath}: source ${currentSourceValue} -> ${newSourceValue}`);

    const newSpecifiers = currentSpecifiers.map((currentSpecifier) => {
      switch (currentSpecifier.type) {
        case "ImportSpecifier": {
          const currentImportedName = currentSpecifier.imported.name;

          if (
            currentImportedName in match.identifier === false ||
            match.identifier[currentImportedName] === null
          ) {
            logger?.error(
              `${filePath}: imported specifier ${currentImportedName}에 대한 변환 정보 없음`,
            );

            return currentSpecifier;
          }

          const { newName, isActionRequired } = match.identifier[currentImportedName];

          const hasNoChange = newName === currentImportedName;
          if (hasNoChange) return currentSpecifier;

          logger?.debug(`${filePath}: imported name ${currentImportedName} -> ${newName}`);
          if (isActionRequired) {
            const message = `${filePath}: ${currentImportedName}을 ${newName}로 변경했지만, 변경된 아이콘이 적절한지 확인이 필요해요`;

            logger?.warn(message);
          }

          const newImportedIdentifier = jscodeshift.identifier(newName);

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

    const newSpecifiersWithoutDuplicates = newSpecifiers.filter((specifier, index, self) => {
      if (specifier.type !== "ImportSpecifier") return true;

      const currentImportedName = specifier.imported.name;

      return (
        self.findIndex(
          (s) => (s as jscodeshift.ImportSpecifier).imported.name === currentImportedName,
        ) === index
      );
    });

    const newImportDeclaration = jscodeshift.importDeclaration(
      newSpecifiersWithoutDuplicates,
      jscodeshift.literal(newSourceValue),
      currentImportKind,
    );

    newImportDeclaration.comments = currentComments;

    return newImportDeclaration;
  });
}

interface MigrateIdentifiersParams {
  identifiers: jscodeshift.Collection<jscodeshift.Identifier>;
  identifierMatch: MigrateIconsOptions["match"]["identifier"];
  logger?: Logger;
  filePath: jscodeshift.FileInfo["path"];
}

export function migrateIdentifiers({
  identifiers,
  identifierMatch,
  logger,
  filePath,
}: MigrateIdentifiersParams) {
  identifiers.replaceWith((identifier) => {
    const currentName = identifier.node.name;

    // unreachable
    if (currentName in identifierMatch === false) return jscodeshift.identifier(currentName);

    if (identifierMatch[currentName] === null) {
      logger?.error(`${filePath}: identifier ${currentName}에 대한 변환 정보 없음`);

      return jscodeshift.identifier(currentName);
    }

    const { newName } = identifierMatch[currentName];
    logger?.debug(`${filePath}: identifier ${currentName} -> ${newName}`);

    return jscodeshift.identifier(newName);
  });
}
