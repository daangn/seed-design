import {
  migrateIdentifiers,
  migrateImportDeclarations,
  type ImportTransformers,
} from "../../utils/migrate";
import jscodeshift from "jscodeshift";
import { describe, expect, test } from "vitest";
import { Biome, Distribution } from "@biomejs/js-api";
import fs from "fs";
import path from "path";

const biome = await Biome.create({ distribution: Distribution.NODE });

describe("shiftingIcons", () => {
  const j = jscodeshift.withParser("tsx");

  const importTransformers: ImportTransformers = {
    source: [{ find: "some-package", replace: "some-new-package" }],
    identifier: [
      { find: "IconLike", replace: "IconHeart" },
      { find: "IconFavorite", replace: "IconStar" },
      { find: "IconHot", replace: "IconFlame" },
      { find: "IconNight", replace: "IconMoon" },
    ],
  };

  const cases = {
    migrateImportDeclarations: ["migrateImportDeclarations"],
    migrateImportDeclarationsVariousTypes: ["migrateImportDeclarations"],
    migrateIdentifiers: ["migrateIdentifiers"],
    migrateImportDeclarationsWithMigrateIdentifiers: [
      "migrateImportDeclarations",
      "migrateIdentifiers",
    ],
    migrateImportDeclarationsVariousTypesWithMigrateIdentifiers: [
      "migrateImportDeclarations",
      "migrateIdentifiers",
    ],
  };

  // migrateImportDeclarations
  for (const name of Object.keys(cases)) {
    test(name, () => {
      const input = fs.readFileSync(path.resolve(__dirname, `./cases/${name}/input.tsx`), "utf-8");
      const expected = fs.readFileSync(
        path.resolve(__dirname, `./cases/${name}/expected.tsx`),
        "utf-8",
      );

      const tree = j(input);
      const firstNode = getFirstNode({ tree, jscodeshift: j });

      if (cases[name].includes("migrateImportDeclarations")) {
        const importDeclarations = tree.find(j.ImportDeclaration);
        migrateImportDeclarations({ importDeclarations, importTransformers });
      }

      if (cases[name].includes("migrateIdentifiers")) {
        const identifiers = tree.find(j.Identifier);
        migrateIdentifiers({ identifiers, identifierTransformers: importTransformers.identifier });
      }

      const firstNodeAfterModification = getFirstNode({ tree, jscodeshift: j });

      if (firstNode !== firstNodeAfterModification) {
        firstNodeAfterModification.comments = firstNode.comments;
      }

      biome.applyConfiguration({ formatter: { indentStyle: "space", lineWidth: 100 } });

      const { content } = biome.formatContent(tree.toSource(), {
        filePath: `${name}.tsx`,
      });

      expect(content).toBe(expected);
    });
  }
});

// XXX: 코드 중복
function getFirstNode({
  tree,
  jscodeshift,
}: { tree: jscodeshift.Collection; jscodeshift: jscodeshift.JSCodeshift }) {
  return tree.find(jscodeshift.Program).get("body", 0).node;
}
