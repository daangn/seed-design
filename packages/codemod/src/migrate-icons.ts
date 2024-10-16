import type { Transform } from "jscodeshift";
import { migrateIdentifiers, migrateImportDeclarations } from "./utils/migrate-node";

export interface MigrateIconsOptions {
  match?: {
    source: { startsWith: string; replaceWith?: string }[];
    identifier: Record<string, string>;
  };
  replaceImportsOnly?: boolean;
}

const reactMatch: MigrateIconsOptions["match"] = {
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
  { match = reactMatch, replaceImportsOnly = false }: MigrateIconsOptions,
) => {
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

  if (importDeclarations.length === 0) return file.source;
  migrateImportDeclarations({ importDeclarations, match });

  if (!replaceImportsOnly) {
    const identifiers = tree.find(j.Identifier, {
      name: (value) => Object.keys(match.identifier).includes(value),
    });

    migrateIdentifiers({ identifiers, identifierMatch: match.identifier });
  }

  const firstNodeAfterModification = getFirstNode();

  if (firstNode !== firstNodeAfterModification) {
    firstNodeAfterModification.comments = firstNode.comments;
  }

  return tree.toSource();
};
