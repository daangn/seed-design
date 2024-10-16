import type { Transform } from "jscodeshift";
import { migrateIdentifiers, migrateImportDeclarations } from "./utils/migrate-node";

export interface MigrateIconsOptions {
  source: { startsWith: string; replaceWith?: string }[];
  identifier: Record<string, string>;
}

const reactOptions: MigrateIconsOptions = {
  source: [
    { startsWith: "@seed-design/icons", replaceWith: "@seed-design/react-icon" },
    { startsWith: "@seed-design/react-icon" },
  ],
  identifier: {
    Icon: "NewIcon",
  },
};

export const migrateIcons: Transform = (
  file,
  api,
  { migrationOptions = reactOptions, replaceImportsOnly = false },
) => {
  const j = api.jscodeshift;
  const tree = j(file.source);

  const getFirstNode = () => tree.find(j.Program).get("body", 0).node;
  const firstNode = getFirstNode();

  const importDeclarations = tree.find(j.ImportDeclaration, {
    source: {
      value: (value) => {
        if (typeof value !== "string") return false;

        return migrationOptions.source.some(({ startsWith }) => value.startsWith(startsWith));
      },
    },
  });

  // 파일에 찾는 import가 없으면 대상 아님 -> return void (which is ok)
  if (importDeclarations.length === 0) return;
  migrateImportDeclarations({ importDeclarations, options: migrationOptions });

  if (!replaceImportsOnly) {
    const identifiers = tree.find(j.Identifier, {
      name: (value) => Object.keys(migrationOptions.identifier).includes(value),
    });

    migrateIdentifiers({ identifiers, options: migrationOptions.identifier });
  }

  const firstNodeAfterModification = getFirstNode();

  if (firstNode !== firstNodeAfterModification) {
    firstNodeAfterModification.comments = firstNode.comments;
  }

  // tree.toSource()에 변화가 있는 경우 파일 변환 성공
  // import match돼서 대상임에도 불구, source도, identifiers도 변화하지 않은 경우 실패로 간주
  return tree.toSource();
};
