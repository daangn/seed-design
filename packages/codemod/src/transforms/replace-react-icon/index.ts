import type { Transform } from "jscodeshift";
import {
  replaceIdentifiers,
  replaceImportDeclarations,
  replaceStringLiterals,
} from "./replace-node.js";
import { createLogger, format, transports } from "winston";
import { identifierMatchReact } from "./identifier-match.js";
import { createTrack } from "../../utils/log.js";

export interface MigrateIconsOptions {
  match?: {
    source: {
      startsWith: string;
      replaceWith: {
        default: string;
        multicolor: string;
      };
    }[];
    identifier: {
      oldName: string;
      newName: string;
      isActionRequired?: boolean;
      moveToMulticolor?: boolean;
    }[];
  };
}

export const reactMatch: MigrateIconsOptions["match"] = {
  source: [
    {
      startsWith: "@seed-design/icon",
      replaceWith: {
        default: "@daangn/react-monochrome-icon",
        multicolor: "@daangn/react-multicolor-icon",
      },
    },
    {
      startsWith: "@seed-design/react-icon",
      replaceWith: {
        default: "@daangn/react-monochrome-icon",
        multicolor: "@daangn/react-multicolor-icon",
      },
    },
    {
      startsWith: "@karrotmarket/karrot-ui-icon/lib/react",
      replaceWith: {
        default: "@daangn/react-monochrome-icon",
        multicolor: "@daangn/react-multicolor-icon",
      },
    },
  ],
  identifier: identifierMatchReact,
};

const migrateIcons: Transform = (file, api, { match = reactMatch }: MigrateIconsOptions) => {
  const track =
    process.env.TRACK === "true"
      ? createTrack({
          transform: "migrate-icons",
          file: file.path,
          ...JSON.parse(process.env.GIT_INFO),
        })
      : undefined;

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

  const oldNames = match.identifier.map(({ oldName }) => oldName);

  const stringLiterals = tree.find(j.StringLiteral, {
    value: (value) =>
      oldNames.includes(value) ||
      match.source.some(({ startsWith }) => value.startsWith(startsWith)),
  });

  logger?.debug(`${file.path}: string literal ${stringLiterals.length}개 발견`);

  logger?.debug(`${file.path}: string literal 변환 시작`);

  replaceStringLiterals({
    stringLiterals,
    match,
    logger,
    report: api.report,
    track,
    filePath: file.path,
  });

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
  }

  logger?.debug(`${file.path}: import문 ${importDeclarations.length}개 발견`);
  replaceImportDeclarations({
    importDeclarations,
    match,
    logger,
    report: api.report,
    track,
    filePath: file.path,
  });

  logger?.debug(`${file.path}: import문 변환 완료`);

  logger?.debug(`${file.path}: identifier 변환 시작`);

  const identifiers = tree.find(j.Identifier, {
    name: (value) => oldNames.includes(value),
  });

  logger?.debug(`${file.path}: identifier ${identifiers.length}개 발견`);
  replaceIdentifiers({
    identifiers,
    identifierMatch: match.identifier,
    logger,
    report: api.report,
    track,
    filePath: file.path,
  });

  const inlineSvgs = tree.find(j.JSXElement, {
    openingElement: {
      name: {
        name: "svg",
      },
    },
  });

  if (inlineSvgs.length > 0) {
    const message = `inline svg가 ${inlineSvgs.length}개 있어요`;

    logger?.warn(`${file.path}: ${message}`);
    console.warn(message);
    api.report?.(message);
    track?.({ event: "inline svg 발견", properties: { count: inlineSvgs.length } });
  }

  logger?.debug(`${file.path}: identifier 변환 완료`);

  logger?.debug(`${file.path}: 확인 완료`);

  return tree.toSource();
};

export default migrateIcons;
