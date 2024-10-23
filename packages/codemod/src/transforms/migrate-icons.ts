import type { Transform } from "jscodeshift";
import { replaceIdentifiers, replaceImportDeclarations } from "../utils/replace-node.js";
import { createLogger, format, transports } from "winston";
import { identifierMatchReact } from "../utils/identifier-match.js";
import { intersection, uniq } from "es-toolkit";

export interface MigrateIconsOptions {
  match?: {
    source: {
      startsWith: string;
      replaceWith?: string;
    }[];
    identifier: {
      [oldName: string]: {
        newName: string;
        isActionRequired?: boolean;
        keepForNow?: boolean;
      };
    };
  };
  replaceIconsKeptForNow?: boolean;
}

export const reactMatch: MigrateIconsOptions["match"] = {
  source: [
    { startsWith: "@seed-design/icon", replaceWith: "@daangn/react-icon" },
    { startsWith: "@seed-design/react-icon", replaceWith: "@daangn/react-icon" },
  ],
  identifier: identifierMatchReact,
};

const migrateIcons: Transform = (
  file,
  api,
  {
    match = reactMatch,
    // XXX: keep for now하기로 결정한 아이콘까지 변경하고 싶으면 true로 배포
    replaceIconsKeptForNow = false,
  }: MigrateIconsOptions,
) => {
  const logger =
    process.env.LOG === "true"
      ? createLogger({
          level: "info",
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            format.printf(
              ({ level, message, timestamp }) =>
                `${timestamp} [${level.toUpperCase()}]: ${message}`,
            ),
          ),
          transports: [
            new transports.File({ filename: "migrate-icons-combined.log", level: "debug" }),
            new transports.File({ filename: "migrate-icons-warnings.log", level: "warn" }),
          ],
        })
      : undefined;

  logger?.debug(`${file.path}: 확인 시작`);

  const j = api.jscodeshift;
  const tree = j(file.source);

  const allOldKeys = Object.keys(match.identifier);
  const allNewTargets = uniq(Object.values(match.identifier).map(({ newName }) => newName));
  const namesThatAppearOnOldAndNew = intersection(allOldKeys, allNewTargets).filter(
    (name) => match.identifier[name].newName !== name,
  );

  const importDeclarations = tree.find(j.ImportDeclaration, {
    source: {
      value: (value: unknown) => {
        if (typeof value !== "string") return false;

        return match.source.some(({ startsWith }) => value.startsWith(startsWith));
      },
    },
  });

  if (importDeclarations.length === 0) {
    logger?.debug(`${file.path}: 이 파일에는 import문 없음`);
    return file.source;
  }

  const specifiersFoundInImportDeclarationsAppearOnOldAndNew = importDeclarations.find(
    j.ImportSpecifier,
    { imported: { name: (value) => namesThatAppearOnOldAndNew.includes(value) } },
  );

  if (specifiersFoundInImportDeclarationsAppearOnOldAndNew.length > 0) {
    const specifiersFound = specifiersFoundInImportDeclarationsAppearOnOldAndNew
      .nodes()
      .map((node) => node.imported.name);

    const mapWithOldName = specifiersFound
      .map((specifier) => `구 ${specifier} -> 신 ${match.identifier[specifier].newName}`)
      .join("\n");

    const matchWithNewName = Object.entries(match.identifier).filter(([_, value]) =>
      specifiersFound.includes(value.newName),
    );

    const mapWithNewName = matchWithNewName
      .map(([oldName, value]) => `구 ${oldName} -> 신 ${value.newName}`)
      .join("\n");

    const message = `${specifiersFound.join(", ")}이 사용되고 있어요. 이 이름은 구 패키지에도 있고 신 패키지에도 있지만, 서로 다른 아이콘을 나타내기 때문에 여러 아이콘이 함께 쓰인 경우 확인이 필요해요.
    ${mapWithOldName}
    ${mapWithNewName}`;

    api.report?.(message);
    logger?.warn(`${file.path}: ${message}`);
    console.warn(message);
  }

  logger?.debug(`${file.path}: import문 ${importDeclarations.length}개 발견`);
  replaceImportDeclarations({
    importDeclarations,
    match,
    logger,
    report: api.report,
    filePath: file.path,
    replaceIconsKeptForNow,
  });

  logger?.debug(`${file.path}: import문 변환 완료`);

  logger?.debug(`${file.path}: identifier 변환 시작`);

  const identifiers = tree.find(j.Identifier, {
    name: (value) => Object.keys(match.identifier).includes(value),
  });

  logger?.debug(`${file.path}: identifier ${identifiers.length}개 발견`);
  replaceIdentifiers({
    identifiers,
    identifierMatch: match.identifier,
    logger,
    report: api.report,
    filePath: file.path,
    replaceIconsKeptForNow,
  });

  logger?.debug(`${file.path}: identifier 변환 완료`);

  logger?.debug(`${file.path}: 확인 완료`);

  return tree.toSource();
};

export default migrateIcons;
