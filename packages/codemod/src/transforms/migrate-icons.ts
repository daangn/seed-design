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
      oldName: string;
      newName: string;
      isActionRequired?: boolean;
      keepForNow?: boolean;
    }[];
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

  const oldNames = match.identifier.map(({ oldName }) => oldName);

  const identifiers = tree.find(j.Identifier, {
    name: (value) => oldNames.includes(value),
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
