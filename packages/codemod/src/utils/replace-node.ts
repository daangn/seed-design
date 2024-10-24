import jscodeshift, { ImportSpecifier } from "jscodeshift";
import type { MigrateIconsOptions } from "../transforms/migrate-icons.js";
import type { Logger } from "winston";
import { partition, uniq, uniqBy, uniqWith } from "es-toolkit";

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
  const iconsWithNewName = match.identifier.map(({ oldName }) => oldName);

  // biome-ignore lint/complexity/noForEach: <explanation>
  importDeclarations.forEach((imp) => {
    const currentSpecifiers = imp.node.specifiers;
    const currentSourceValue = imp.node.source.value;
    const currentImportKind = imp.node.importKind;
    const currentComments = imp.node.comments;

    const exactSourceMatch = match.source.find(
      ({ startsWith }) => startsWith === currentSourceValue,
    );
    const deepImportMatch =
      !exactSourceMatch &&
      match.source.find(({ startsWith }) =>
        typeof currentSourceValue !== "string" ? false : currentSourceValue.startsWith(startsWith),
      );

    if (
      exactSourceMatch &&
      currentSpecifiers.every((specifier) => specifier.type === "ImportNamespaceSpecifier")
    ) {
      const newSourceValue = exactSourceMatch.replaceWith;

      const importDeclaration = jscodeshift.importDeclaration(
        currentSpecifiers,
        jscodeshift.literal(newSourceValue),
        currentImportKind,
      );

      importDeclaration.comments = currentComments;

      jscodeshift(imp).replaceWith(importDeclaration);
    }

    if (
      exactSourceMatch &&
      currentSpecifiers.every((specifier) => specifier.type === "ImportSpecifier")
    ) {
      const specifiersWithoutIconsWithoutNewName = currentSpecifiers.filter((specifier) =>
        iconsWithNewName.includes(specifier.imported.name),
      );

      const [specifiersToKeepInCurrentPackage, specifiersToMigrateToNewPackage] = partition(
        specifiersWithoutIconsWithoutNewName,
        (specifier) =>
          !replaceIconsKeptForNow &&
          match.identifier.find(({ oldName }) => oldName === specifier.imported.name)?.keepForNow,
      );

      if (specifiersToKeepInCurrentPackage.length > 0) {
        const importDeclaration = jscodeshift.importDeclaration(
          specifiersToKeepInCurrentPackage,
          jscodeshift.literal(currentSourceValue),
          currentImportKind,
        );

        importDeclaration.comments = currentComments;

        jscodeshift(imp).insertAfter(importDeclaration);
      }

      if (specifiersToMigrateToNewPackage.length > 0) {
        const newSpecifiers = specifiersToMigrateToNewPackage.map((currentSpecifier) => {
          // 먼저 match된 것을 사용 (home -> house -> window4house 대응)
          const matchFound = match.identifier.find(
            (match) => match.oldName === currentSpecifier.imported.name,
          );

          if (!matchFound) {
            const message = `imported specifier ${currentSpecifier.imported.name}에 대한 변환 정보 없음`;

            logger?.error(`${filePath}: ${message}`);
            console.warn(message);
            report?.(message);

            return currentSpecifier;
          }

          if (!replaceIconsKeptForNow && matchFound.keepForNow) {
            const message = `import source ${currentSourceValue}에 대한 변환 정보가 있지만, 아직 신규 아이콘 패키지에 배포되지 않아 변환하지 않아요`;

            logger?.warn(`${filePath}: ${message}`);
            console.warn(message);
            report?.(message);

            return currentSpecifier;
          }

          if (matchFound.isActionRequired) {
            const message = `imported specifier ${currentSpecifier.imported.name}을 ${matchFound.newName}로 변경했지만, 변경된 아이콘이 적절한지 확인이 필요해요`;

            logger?.warn(`${filePath}: ${message}`);
            console.warn(message);
            report?.(message);
          }

          return jscodeshift.importSpecifier(
            jscodeshift.identifier(matchFound.newName),
            jscodeshift.identifier(
              currentSpecifier.local.name === matchFound.oldName
                ? matchFound.newName
                : currentSpecifier.local.name,
            ),
          );
        });

        const newSpecifiersWithoutDuplicates = uniqWith(
          newSpecifiers,
          (a, b) => a.type === b.type && a.imported.name === b.imported.name,
        );

        const importDeclaration = jscodeshift.importDeclaration(
          newSpecifiersWithoutDuplicates,
          jscodeshift.literal(exactSourceMatch.replaceWith),
          currentImportKind,
        );

        importDeclaration.comments = currentComments;

        jscodeshift(imp).insertAfter(importDeclaration);
      }

      if (specifiersWithoutIconsWithoutNewName.length > 0) {
        jscodeshift(imp).remove();
      }
    }

    if (
      deepImportMatch &&
      currentSpecifiers.every((specifier) => specifier.type === "ImportDefaultSpecifier")
    ) {
      const newSourceValue = (() => {
        if (typeof currentSourceValue !== "string") return currentSourceValue;

        const splits = currentSourceValue.split("/");

        let shouldKeepPackageName = false;

        const splitsWithIconNameReplaced = splits.map((split, index) => {
          // 마지막 아닌 경우 pass
          if (index !== splits.length - 1) return split;

          const matchFound = match.identifier.find(({ oldName }) => oldName === split);

          // 마지막인데 match 없는 경우 pass
          if (!matchFound) return split;

          if (!replaceIconsKeptForNow && matchFound.keepForNow) {
            const message = `import source ${currentSourceValue}에 대한 변환 정보가 있지만, 아직 신규 아이콘 패키지에 배포되지 않아 변환하지 않아요`;

            logger?.warn(`${filePath}: ${message}`);
            console.warn(message);
            report?.(message);

            shouldKeepPackageName = true;

            return split;
          }

          if (matchFound.isActionRequired) {
            const message = `import source ${currentSourceValue}을 ${matchFound.newName}로 변경했지만, 변경된 아이콘이 적절한지 확인이 필요해요`;

            logger?.warn(`${filePath}: ${message}`);
            console.warn(message);
            report?.(message);
          }

          return matchFound.newName;
        });

        if (shouldKeepPackageName) return splitsWithIconNameReplaced.join("/");

        const sourceMatch = match.source.find(({ startsWith }) =>
          currentSourceValue.startsWith(startsWith),
        );

        if (!sourceMatch) return splitsWithIconNameReplaced.join("/");

        const newPackageName = splitsWithIconNameReplaced
          .join("/")
          .replace(sourceMatch.startsWith, sourceMatch.replaceWith);

        return newPackageName;
      })();

      const newSpecifiers = currentSpecifiers.map((currentSpecifier) => {
        const matchFound = match.identifier.find(
          (match) => match.oldName === currentSpecifier.local.name,
        );

        if (!matchFound) return currentSpecifier;

        if (!replaceIconsKeptForNow && matchFound.keepForNow) {
          const message = `import source ${currentSourceValue}에 대한 변환 정보가 있지만, 아직 신규 아이콘 패키지에 배포되지 않아 변환하지 않아요`;

          logger?.warn(`${filePath}: ${message}`);
          console.warn(message);
          report?.(message);

          return currentSpecifier;
        }

        if (matchFound.isActionRequired) {
          const message = `imported specifier ${currentSpecifier.local.name}을 ${matchFound.newName}로 변경했지만, 변경된 아이콘이 적절한지 확인이 필요해요`;

          logger?.warn(`${filePath}: ${message}`);
          console.warn(message);
          report?.(message);
        }

        return jscodeshift.importDefaultSpecifier(
          jscodeshift.identifier(
            currentSpecifier.local.name === matchFound.oldName
              ? matchFound.newName
              : currentSpecifier.local.name,
          ),
        );
      });

      const importDeclaration = jscodeshift.importDeclaration(
        newSpecifiers,
        jscodeshift.literal(newSourceValue),
        currentImportKind,
      );

      importDeclaration.comments = currentComments;

      jscodeshift(imp).replaceWith(importDeclaration);
    }
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
  report,
  filePath,
  replaceIconsKeptForNow,
}: ReplaceIdentifiersParams) {
  // biome-ignore lint/complexity/noForEach: <explanation>
  identifiers.forEach((identifier) => {
    // 먼저 match된 것을 사용 (home -> house -> window4house 대응)
    const matchFound = identifierMatch.find(({ oldName }) => oldName === identifier.node.name);

    if (!matchFound) return;

    if (!replaceIconsKeptForNow && matchFound.keepForNow) {
      const message = `identifier ${identifier.node.name}에 대한 변환 정보가 있지만, 아직 신규 아이콘 패키지에 배포되지 않아 변환하지 않아요`;

      logger?.warn(`${filePath}: ${message}`);
      console.warn(message);
      report?.(message);

      return;
    }

    if (matchFound.isActionRequired) {
      const message = `identifier ${identifier.node.name}을 ${matchFound.newName}로 변경했지만, 변경된 아이콘이 적절한지 확인이 필요해요`;

      logger?.warn(`${filePath}: ${message}`);
      console.warn(message);
      report?.(message);
    }

    const newName = matchFound.newName;

    logger?.debug(`${filePath}: identifier ${identifier.node.name} -> ${newName}`);

    identifier.replace(jscodeshift.identifier(newName));
  });
}
