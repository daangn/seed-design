import jscodeshift from "jscodeshift";
import type { MigrateIconsOptions } from "./index.js";
import type { Logger } from "winston";
import { partition, uniqWith } from "es-toolkit";
import type { createTrack } from "../../utils/log.js";

interface ReplaceImportDeclarationsParams {
  importDeclarations: jscodeshift.Collection<jscodeshift.ImportDeclaration>;
  match: MigrateIconsOptions["match"];
  logger?: Logger;
  report?: jscodeshift.API["report"];
  track?: ReturnType<typeof createTrack>;
  filePath: jscodeshift.FileInfo["path"];
}

export function replaceImportDeclarations({
  importDeclarations,
  match,
  logger,
  report,
  track,
  filePath,
}: ReplaceImportDeclarationsParams) {
  const availableNewNames = match.identifier.map(({ oldName }) => oldName);

  importDeclarations.forEach((imp) => {
    const currentSpecifiers = imp.node.specifiers;
    const currentSourceValue = imp.node.source.value;
    const currentImportKind = imp.node.importKind;
    const currentComments = imp.node.comments;

    const standardImportSourceMatch = match.source.find(
      ({ startsWith }) => startsWith === currentSourceValue,
    );
    const deepImportSourceMatch =
      !standardImportSourceMatch &&
      match.source.find(({ startsWith }) =>
        typeof currentSourceValue !== "string" ? false : currentSourceValue.startsWith(startsWith),
      );

    // import * as package from "package";
    if (
      standardImportSourceMatch &&
      currentSpecifiers.every((specifier) => specifier.type === "ImportNamespaceSpecifier")
    ) {
      const newImportDeclaration = jscodeshift.importDeclaration(
        currentSpecifiers,
        jscodeshift.literal(standardImportSourceMatch.replaceWith.default),
        currentImportKind,
      );

      newImportDeclaration.comments = currentComments;

      jscodeshift(imp).replaceWith(newImportDeclaration);
    }

    // import { specifier1, specifier2 } from "package";
    if (
      standardImportSourceMatch &&
      currentSpecifiers.every((specifier) => specifier.type === "ImportSpecifier")
    ) {
      const [specifiersToMoveToDefaultPackage, specifiersToMoveToMulticolor] = partition(
        currentSpecifiers,
        (specifier) =>
          !match.identifier.find(({ oldName }) => oldName === specifier.imported.name)
            ?.moveToMulticolor,
      );

      // 새 패키지의 default 버전으로 마이그레이션할 specifiers
      const newSpecifiersToMoveToDefaultPackage = getNewSpecifiersWithoutDuplicates({
        specifiers: specifiersToMoveToDefaultPackage,
      });
      if (newSpecifiersToMoveToDefaultPackage.length > 0) {
        const newImportDeclaration = jscodeshift.importDeclaration(
          newSpecifiersToMoveToDefaultPackage,
          jscodeshift.literal(standardImportSourceMatch.replaceWith.default),
          currentImportKind,
        );

        newImportDeclaration.comments = currentComments;

        jscodeshift(imp).insertAfter(newImportDeclaration);
      }

      // 새 패키지의 multicolor 버전으로 마이그레이션할 specifiers
      const newSpecifiersToMoveToMulticolor = getNewSpecifiersWithoutDuplicates({
        specifiers: specifiersToMoveToMulticolor,
      });
      if (newSpecifiersToMoveToMulticolor.length > 0) {
        const iconsString = specifiersToMoveToMulticolor
          .map(({ imported }) => imported.name)
          .join(", ");
        const message = `import specifier ${iconsString}를 멀티컬러 패키지의 아이콘으로 변환했지만, 멀티컬러 사용이 적절한지 확인이 필요해요`;

        logger?.warn(`${filePath}: ${message}`);
        console.warn(message);
        report?.(message);
        track?.({
          event: "멀티컬러 아이콘 사용",
          properties: { type: "importSpecifier", icons: iconsString },
        });

        const newImportDeclaration = jscodeshift.importDeclaration(
          newSpecifiersToMoveToMulticolor,
          jscodeshift.literal(standardImportSourceMatch.replaceWith.multicolor),
          currentImportKind,
        );

        newImportDeclaration.comments = currentComments;

        jscodeshift(imp).insertAfter(newImportDeclaration);
      }

      const specifiersWithNewNameAvailable = currentSpecifiers.filter((specifier) =>
        availableNewNames.includes(specifier.imported.name),
      );

      // 모든 specifier가 새 패키지(default or multicolor)로 이동되었을 경우 기존 import문 제거
      if (specifiersWithNewNameAvailable.length > 0) {
        jscodeshift(imp).remove();
      }
    }

    // import Icon from "package/some/path/to/Icon";
    if (
      deepImportSourceMatch &&
      currentSpecifiers.every((specifier) => specifier.type === "ImportDefaultSpecifier")
    ) {
      const newSourceValue = (() => {
        if (typeof currentSourceValue !== "string") return currentSourceValue;

        const splits = currentSourceValue.split("/");

        let shouldMigrateToMulticolor = false;

        const splitsWithIconNameReplaced = splits.map((split, index) => {
          // 마지막 아닌 경우 pass
          if (index !== splits.length - 1) return split;

          const matchFound = match.identifier.find(({ oldName }) => oldName === split);

          // 마지막인데 match 없는 경우 pass
          if (!matchFound) return split;

          if (matchFound.isActionRequired) {
            const message = `import source ${currentSourceValue}을 ${matchFound.newName}로 변경했지만, 변경된 아이콘이 적절한지 확인이 필요해요`;

            logger?.warn(`${filePath}: ${message}`);
            console.warn(message);
            report?.(message);
            track?.({
              event: "확인 필요한 아이콘 사용",
              properties: { type: "importDefaultSpecifier", source: currentSourceValue },
            });
          }

          if (matchFound.moveToMulticolor) {
            shouldMigrateToMulticolor = true;
          }

          // multicolor로 이동하는지는 이 스코프에서 안 중요

          return matchFound.newName;
        });

        const sourceMatch = match.source.find(({ startsWith }) =>
          currentSourceValue.startsWith(startsWith),
        );

        if (!sourceMatch) return splitsWithIconNameReplaced.join("/");

        return splitsWithIconNameReplaced
          .join("/")
          .replace(
            sourceMatch.startsWith,
            shouldMigrateToMulticolor
              ? sourceMatch.replaceWith.multicolor
              : sourceMatch.replaceWith.default,
          );
      })();

      const newSpecifiers = currentSpecifiers.map((currentSpecifier) => {
        const matchFound = match.identifier.find(
          (match) => match.oldName === currentSpecifier.local.name,
        );

        if (!matchFound) return currentSpecifier;

        if (matchFound.moveToMulticolor) {
          const message = `import specifier ${matchFound.oldName}를 멀티컬러 패키지의 ${matchFound.newName}로 변환했지만, 멀티컬러 사용이 적절한지 확인이 필요해요`;

          logger?.warn(`${filePath}: ${message}`);
          console.warn(message);
          report?.(message);
          track?.({
            event: "멀티컬러 아이콘 사용",
            properties: { type: "importDefaultSpecifier", icon: matchFound.oldName },
          });
        }

        if (matchFound.isActionRequired) {
          const message = `import specifier ${currentSpecifier.local.name}을 ${matchFound.newName}로 변경했지만, 변경된 아이콘이 적절한지 확인이 필요해요`;

          logger?.warn(`${filePath}: ${message}`);
          console.warn(message);
          report?.(message);
          track?.({
            event: "확인 필요한 아이콘 사용",
            properties: { type: "importDefaultSpecifier", icon: currentSpecifier.local.name },
          });
        }

        return jscodeshift.importDefaultSpecifier(
          jscodeshift.identifier(
            currentSpecifier.local.name === matchFound.oldName
              ? matchFound.newName
              : currentSpecifier.local.name,
          ),
        );
      });

      const newImportDeclaration = jscodeshift.importDeclaration(
        newSpecifiers,
        jscodeshift.literal(newSourceValue),
        currentImportKind,
      );

      newImportDeclaration.comments = currentComments;

      jscodeshift(imp).replaceWith(newImportDeclaration);
    }
  });

  function getNewSpecifiersWithoutDuplicates({
    specifiers,
  }: {
    specifiers: jscodeshift.ImportSpecifier[];
  }) {
    const newSpecifiers = specifiers
      .map((currentSpecifier) => {
        // 먼저 match된 것을 사용 (home -> house -> window4house 대응)
        const matchFound = match.identifier.find(
          (match) => match.oldName === currentSpecifier.imported.name,
        );

        if (!matchFound) {
          const message = `import specifier ${currentSpecifier.imported.name}에 대한 변환 정보 없음`;

          logger?.error(`${filePath}: ${message}`);
          console.warn(message);
          report?.(message);
          track?.({
            event: "변환 정보 없음",
            properties: { type: "importSpecifier", icon: currentSpecifier.imported.name },
          });

          return null;
        }

        if (matchFound.isActionRequired) {
          const message = `import specifier ${currentSpecifier.imported.name}을 ${matchFound.newName}로 변경했지만, 변경된 아이콘이 적절한지 확인이 필요해요`;

          logger?.warn(`${filePath}: ${message}`);
          console.warn(message);
          report?.(message);
          track?.({
            event: "확인 필요한 아이콘 사용",
            properties: { type: "importSpecifier", icon: currentSpecifier.imported.name },
          });
        }

        const newSpecifier = jscodeshift.importSpecifier(
          jscodeshift.identifier(matchFound.newName),
          jscodeshift.identifier(
            currentSpecifier.local.name === matchFound.oldName
              ? matchFound.newName
              : currentSpecifier.local.name,
          ),
        );

        newSpecifier.comments = currentSpecifier.comments;

        return newSpecifier;
      })
      .filter(Boolean);

    const newSpecifiersWithoutDuplicates = uniqWith(
      newSpecifiers,
      (a, b) => a.type === b.type && a.imported.name === b.imported.name,
    );

    return newSpecifiersWithoutDuplicates;
  }
}

interface ReplaceIdentifiersParams {
  identifiers: jscodeshift.Collection<jscodeshift.Identifier>;
  identifierMatch: MigrateIconsOptions["match"]["identifier"];
  logger?: Logger;
  report?: jscodeshift.API["report"];
  track?: ReturnType<typeof createTrack>;
  filePath: jscodeshift.FileInfo["path"];
}

export function replaceIdentifiers({
  identifiers,
  identifierMatch,
  logger,
  report,
  track,
  filePath,
}: ReplaceIdentifiersParams) {
  identifiers.forEach((identifier) => {
    // import specifier인 경우 아무것도 안 함 (replaceImportDeclarations에서 처리)
    if (
      identifier.parent?.node.type === "ImportSpecifier" ||
      identifier.parent?.node.type === "ImportDefaultSpecifier"
    )
      return;

    // 먼저 match된 것을 사용 (home -> house -> window4house 대응)
    const matchFound = identifierMatch.find(({ oldName }) => oldName === identifier.node.name);

    if (!matchFound) return;

    if (matchFound.moveToMulticolor) {
      const message = `identifier ${matchFound.oldName}를 멀티컬러 패키지의 ${matchFound.newName}로 변환했지만, 멀티컬러 사용이 적절한지 확인이 필요해요`;

      logger?.warn(`${filePath}: ${message}`);
      console.warn(message);
      report?.(message);
      track?.({
        event: "멀티컬러 아이콘 사용",
        properties: { type: "identifier", icon: matchFound.oldName },
      });
    }

    if (matchFound.isActionRequired) {
      const message = `identifier ${identifier.node.name}을 ${matchFound.newName}로 변경했지만, 변경된 아이콘이 적절한지 확인이 필요해요`;

      logger?.warn(`${filePath}: ${message}`);
      console.warn(message);
      report?.(message);
      track?.({
        event: "확인 필요한 아이콘 사용",
        properties: { type: "identifier", icon: identifier.node.name },
      });
    }

    const newName = matchFound.newName;

    logger?.debug(`${filePath}: identifier ${identifier.node.name} -> ${newName}`);
    track?.({
      event: "변환",
      properties: { type: "identifier", oldName: identifier.node.name, newName },
    });

    identifier.replace(jscodeshift.identifier(newName));
  });
}

interface ReplaceStringLiteralsProps {
  stringLiterals: jscodeshift.Collection<jscodeshift.StringLiteral>;
  match: MigrateIconsOptions["match"];
  logger?: Logger;
  report?: jscodeshift.API["report"];
  track?: ReturnType<typeof createTrack>;
  filePath: jscodeshift.FileInfo["path"];
}

export function replaceStringLiterals({
  stringLiterals,
  match,
  logger,
  report,
  track,
  filePath,
}: ReplaceStringLiteralsProps) {
  stringLiterals.forEach((stringLiteral) => {
    const identifierMatchFound = match.identifier.find(
      ({ oldName }) => oldName === stringLiteral.node.value,
    );
    const sourceMatchFound = match.source.find(({ startsWith }) =>
      stringLiteral.node.value.startsWith(startsWith),
    );

    if (identifierMatchFound) {
      if (identifierMatchFound.isActionRequired) {
        const message = `string literal ${stringLiteral.node.value}을 ${identifierMatchFound.newName}로 변경했지만, 변경된 아이콘이 적절한지 확인이 필요해요`;

        logger?.warn(`${filePath}: ${message}`);
        console.warn(message);
        report?.(message);
        track?.({
          event: "확인 필요한 아이콘 사용",
          properties: { type: "stringLiteral", icon: stringLiteral.node.value },
        });
      }

      if (identifierMatchFound.moveToMulticolor) {
        const message = `string literal ${stringLiteral.node.value}를 멀티컬러 패키지의 ${identifierMatchFound.newName}로 변환했지만, 멀티컬러 사용이 적절한지 확인이 필요해요`;

        logger?.warn(`${filePath}: ${message}`);
        console.warn(message);
        report?.(message);
        track?.({
          event: "멀티컬러 아이콘 사용",
          properties: { type: "stringLiteral", icon: stringLiteral.node.value },
        });
      }

      const newName = identifierMatchFound.newName;

      logger?.debug(`${filePath}: string literal ${stringLiteral.node.value} -> ${newName}`);
      track?.({
        event: "변환",
        properties: { type: "stringLiteral", oldName: stringLiteral.node.value, newName },
      });

      stringLiteral.replace(jscodeshift.stringLiteral(newName));
    }

    if (sourceMatchFound && stringLiteral.parent?.node.type !== "ImportDeclaration") {
      const sourceMatch = match.source.find(({ startsWith }) =>
        stringLiteral.node.value.startsWith(startsWith),
      );

      if (!sourceMatch) return;

      const identifierMatchFoundAtLast = match.identifier.find(
        ({ oldName }) => oldName === stringLiteral.node.value.split("/").pop(),
      );

      const newSourceValue = stringLiteral.node.value
        .replace(
          sourceMatch.startsWith,
          identifierMatchFoundAtLast?.moveToMulticolor
            ? sourceMatch.replaceWith.multicolor
            : sourceMatch.replaceWith.default,
        )
        .split("/")
        .map((split, index) => {
          const matchFound = match.identifier.find(({ oldName }) => oldName === split);

          if (!matchFound || index !== stringLiteral.node.value.split("/").length - 1) return split;

          if (matchFound.isActionRequired) {
            const message = `string literal ${stringLiteral.node.value}을 ${matchFound.newName}로 변경했지만, 변경된 아이콘이 적절한지 확인이 필요해요`;

            logger?.warn(`${filePath}: ${message}`);
            console.warn(message);
            report?.(message);
            track?.({
              event: "확인 필요한 아이콘 사용",
              properties: { type: "stringLiteral", icon: stringLiteral.node.value },
            });
          }

          if (matchFound.moveToMulticolor) {
            const message = `string literal ${stringLiteral.node.value}를 멀티컬러 패키지의 ${matchFound.newName}로 변환했지만, 멀티컬러 사용이 적절한지 확인이 필요해요`;

            logger?.warn(`${filePath}: ${message}`);
            console.warn(message);
            report?.(message);
            track?.({
              event: "멀티컬러 아이콘 사용",
              properties: { type: "stringLiteral", icon: stringLiteral.node.value },
            });
          }

          return matchFound.newName;
        })
        .join("/");

      stringLiteral.replace(jscodeshift.stringLiteral(newSourceValue));

      logger?.debug(`${filePath}: string literal ${stringLiteral.node.value} -> ${newSourceValue}`);
      track?.({
        event: "변환",
        properties: {
          type: "stringLiteral",
          oldName: stringLiteral.node.value,
          newName: newSourceValue,
        },
      });
    }
  });
}
