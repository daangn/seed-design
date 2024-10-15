import {
  migrateIdentifiers,
  migrateImportDeclarations,
  type ImportTransformers,
} from "../utils/migrate";
import jscodeshift from "jscodeshift";
import { describe, expect, test } from "vitest";

describe("shiftingIcons", () => {
  const j = jscodeshift.withParser("tsx");

  const importTransformers: ImportTransformers = {
    source: [{ find: "some-package", replace: "some-new-package" }],
    identifier: [
      { find: /^IconLike$/, replace: "IconHeart" },
      { find: /^IconFavorite$/, replace: "IconStar" },
      { find: /^IconHot$/, replace: "IconFlame" },
      { find: /^IconNight$/, replace: "IconMoon" },
    ],
  };

  test("migrateImportDeclarations", () => {
    const input = `import { IconLike } from "some-package";`;
    const expected = `import { IconHeart as IconLike } from "some-new-package";`;

    const tree = j(input);
    const importDeclarations = tree.find(j.ImportDeclaration);

    migrateImportDeclarations({ importDeclarations, importTransformers });

    expect(tree.toSource()).toBe(expected);
  });

  test("migrateImportDeclarations with various import declarations", () => {
    const input = `import { IconLike } from "some-package";
import { IconFavorite } from "some-package";
import IconNight from "some-package/IconNight";
import * as IconHot from "some-package/IconHot";`;
    const expected = `import { IconHeart as IconLike } from "some-new-package";
import { IconStar as IconFavorite } from "some-new-package";
import IconNight from "some-new-package/IconMoon";
import * as IconHot from "some-new-package/IconFlame";`;

    const tree = j(input);
    const importDeclarations = tree.find(j.ImportDeclaration);

    migrateImportDeclarations({
      importDeclarations,
      importTransformers,
    });

    expect(tree.toSource()).toBe(expected);
  });

  test("migrateIdentifiers", () => {
    const input = `export function IconDiv() {
	console.log(IconLike);

	return (
		<div>
			<IconLike />
		</div>
	);
}`;
    const expected = `export function IconDiv() {
	console.log(IconHeart);

	return (
        (<div>
            <IconHeart />
        </div>)
    );
}`;

    const tree = j(input);
    const identifiers = tree.find(j.Identifier);

    migrateIdentifiers({
      identifiers,
      identifierTransformers: importTransformers.identifier,
    });

    console.log(tree.toSource());

    expect(tree.toSource()).toBe(expected);
  });
});
