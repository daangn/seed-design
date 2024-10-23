import jscodeshift, { type ImportSpecifier } from "jscodeshift";
import type { MigrateIconsOptions } from "../transforms/migrate-icons.js";
import type { Logger } from "winston";
import { partition } from "es-toolkit";

interface ReplaceImportDeclarationsParams {
  importDeclarations: jscodeshift.Collection<jscodeshift.ImportDeclaration>;
  match: MigrateIconsOptions["match"];
  logger?: Logger;
  report?: jscodeshift.API["report"];
  filePath: jscodeshift.FileInfo["path"];
  replaceIconsKeptForNow?: boolean;
}

export function replaceImportDeclarations({
  importDeclarations,
  match,
  logger,
  report,
  filePath,
  replaceIconsKeptForNow,
}: ReplaceImportDeclarationsParams) {
  // biome-ignore lint/complexity/noForEach: <explanation>
  importDeclarations.forEach((imp) => {
    const currentSpecifiers = imp.node.specifiers;
    const currentSourceValue = imp.node.source.value;
    const currentImportKind = imp.node.importKind;
    const currentComments = imp.node.comments;

    const [specifiersToKeepInCurrentPackage, specifiersToMigrateToNewPackage] = partition(
      currentSpecifiers,
      (specifier) =>
        !replaceIconsKeptForNow &&
        specifier.type === "ImportSpecifier" &&
        specifier.imported.name in match.identifier &&
        match.identifier[specifier.imported.name].keepForNow,
    );

    const oldPackageImportDeclaration =
      replaceIconsKeptForNow || specifiersToKeepInCurrentPackage.length === 0
        ? null
        : jscodeshift.importDeclaration(
            specifiersToKeepInCurrentPackage,
            jscodeshift.literal(currentSourceValue),
            currentImportKind,
          );

    if (oldPackageImportDeclaration) {
      oldPackageImportDeclaration.comments = currentComments;
    }

    const newSpecifiers = specifiersToMigrateToNewPackage.map((currentSpecifier) => {
      switch (currentSpecifier.type) {
        case "ImportSpecifier": {
          const currentImportedName = currentSpecifier.imported.name;

          if (currentImportedName in match.identifier === false) {
            const message = `imported specifier ${currentImportedName}에 대한 변환 정보 없음`;

            logger?.error(`${filePath}: ${message}`);
            console.warn(message);
            report?.(message);

            return currentSpecifier;
          }

          const { newName, isActionRequired } = match.identifier[currentImportedName];

          if (newName !== currentImportedName) {
            logger?.debug(`${filePath}: imported name ${currentImportedName} -> ${newName}`);
          }

          if (isActionRequired) {
            const message = `imported specifier ${currentImportedName}을 ${newName}로 변경했지만, 변경된 아이콘이 적절한지 확인이 필요해요`;

            logger?.warn(`${filePath}: ${message}`);
            console.warn(message);
            report?.(message);
          }

          // local name 유지하는 이유: local name은 replaceIdentifiers에서 처리
          return jscodeshift.importSpecifier(
            jscodeshift.identifier(newName),
            currentSpecifier.local,
          );
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

    const newSourceValue = (() => {
      if (typeof currentSourceValue !== "string") return currentSourceValue;

      const { startsWith, replaceWith } = match.source.find(({ startsWith }) =>
        currentSourceValue.startsWith(startsWith),
      );

      const sourceReplaced = replaceWith
        ? currentSourceValue.replace(startsWith, replaceWith)
        : currentSourceValue;

      const slashSplits = sourceReplaced.split("/");

      const result = slashSplits
        .map((split, index) => {
          if (index !== slashSplits.length - 1 || split in match.identifier === false) return split;

          if (!replaceIconsKeptForNow && match.identifier[split].keepForNow) {
            const message = `import source ${currentSourceValue}에 대한 변환 정보가 있지만, 아직 신규 아이콘 패키지에 배포되지 않아 변환하지 않아요`;

            logger?.warn(`${filePath}: ${message}`);
            console.warn(message);
            report?.(message);

            return split;
          }

          return match.identifier[split].newName;
        })
        .join("/");

      return result;
    })();

    const newPackageImportDeclaration =
      newSpecifiersWithoutDuplicates.length === 0
        ? null
        : jscodeshift.importDeclaration(
            newSpecifiersWithoutDuplicates,
            jscodeshift.literal(newSourceValue),
            currentImportKind,
          );

    if (newPackageImportDeclaration) {
      newPackageImportDeclaration.comments = currentComments;
    }

    if (replaceIconsKeptForNow) {
      jscodeshift(imp).replaceWith(newPackageImportDeclaration);
      return;
    }

    jscodeshift(imp).replaceWith([oldPackageImportDeclaration, newPackageImportDeclaration]);
  });
}

interface ReplaceIdentifiersParams {
  identifiers: jscodeshift.Collection<jscodeshift.Identifier>;
  identifierMatch: MigrateIconsOptions["match"]["identifier"];
  logger?: Logger;
  report?: jscodeshift.API["report"];
  filePath: jscodeshift.FileInfo["path"];
  replaceIconsKeptForNow?: boolean;
}

export function replaceIdentifiers({
  identifiers,
  identifierMatch,
  logger,
  report: _report,
  filePath,
  replaceIconsKeptForNow,
}: ReplaceIdentifiersParams) {
  identifiers.replaceWith((identifier) => {
    const currentName = identifier.node.name;

    if (currentName in identifierMatch === false) {
      const message = `identifier ${currentName}에 대한 변환 정보가 없어요`;

      logger?.error(`${filePath}: ${message}`);

      return jscodeshift.identifier(currentName);
    }

    if (!replaceIconsKeptForNow && identifierMatch[currentName].keepForNow) {
      const message = `identifier ${currentName}에 대한 변환 정보가 있지만, 아직 신규 아이콘 패키지에 배포되지 않아 변환하지 않아요`;

      logger?.warn(`${filePath}: ${message}`);

      return jscodeshift.identifier(currentName);
    }

    const { newName } = identifierMatch[currentName];
    logger?.debug(`${filePath}: identifier ${currentName} -> ${newName}`);

    return jscodeshift.identifier(newName);
  });
}
