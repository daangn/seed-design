import type { Transform } from "jscodeshift";
import { migrateIdentifiers, migrateImportDeclarations } from "../utils/replace-node.js";
import { createLogger } from "winston";
import { loggerOptions } from "../utils/log.js";
import { identifierMapReact } from "../utils/identifier-map.js";

export interface MigrateIconsOptions {
  match?: {
    source: { startsWith: string; replaceWith?: string }[];
    identifier: Record<string, string>;
  };
}

const reactMatch: MigrateIconsOptions["match"] = {
  source: [
    { startsWith: "@seed-design/icon", replaceWith: "@seed-design/react-icon" },
    { startsWith: "@seed-design/react-icon" },
  ],
  identifier: identifierMapReact,
};

const migrateIcons: Transform = (file, api, { match = reactMatch }: MigrateIconsOptions) => {
  const logger = createLogger(loggerOptions);

  logger.debug(`${file.path}: 확인 시작`);

  const j = api.jscodeshift;
  const tree = j(file.source);

  const getFirstNode = () => tree.find(j.Program).get("body", 0).node;
  const firstNode = getFirstNode();

  const importDeclarations = tree.find(j.ImportDeclaration, {
    source: {
      value: (value: unknown) => {
        if (typeof value !== "string") return false;

        return match.source.some(({ startsWith }) => value.startsWith(startsWith));
      },
    },
  });

  if (importDeclarations.length === 0) {
    logger.debug(`${file.path}: 이 파일에는 import문 없음`);
    return file.source;
  }

  logger.debug(`${file.path}: import문 ${importDeclarations.length}개 발견`);
  migrateImportDeclarations({ importDeclarations, match, logger, filePath: file.path });

  logger.debug(`${file.path}: import문 변환 완료`);

  logger.debug(`${file.path}: identifier 변환 시작`);

  const identifiers = tree.find(j.Identifier, {
    name: (value) => Object.keys(match.identifier).includes(value),
  });

  logger.debug(`${file.path}: identifier ${identifiers.length}개 발견`);
  migrateIdentifiers({
    identifiers,
    identifierMatch: match.identifier,
    logger,
    filePath: file.path,
  });

  logger.debug(`${file.path}: identifier 변환 완료`);

  const firstNodeAfterModification = getFirstNode();

  if (firstNode !== firstNodeAfterModification) {
    firstNodeAfterModification.comments = firstNode.comments;
  }

  logger.debug(`${file.path}: 확인 완료`);

  return tree.toSource();
};

export default migrateIcons;