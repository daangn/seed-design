import { migrateIcons, type MigrateIconsOptions } from "../migrate-icons";
import { describe, expect, test } from "vitest";
import { applyTransform } from "jscodeshift/src/testUtils";
import type { FileInfo } from "jscodeshift";

const testOptions: MigrateIconsOptions = {
  source: [
    { startsWith: "@scope/some-old-package", replaceWith: "@scope/some-new-package" },
    { startsWith: "@scope/some-package-not-to-be-changed" },
  ],
  identifier: {
    Icon1: "NewIcon1",
    Icon2: "NewIcon2",
    Icon3: "NewIcon3",
    Icon4: "NewIcon4",
    Icon5: "NewIcon5",
    Icon6: "NewIcon6",
    Icon7: "NewIcon7",
    Icon8: "NewIcon8",
    Icon9: "NewIcon9",
    Icon10: "NewIcon10",
    Icon11: "NewIcon11",
    Icon12: "NewIcon12",
    Icon13: "NewIcon13",
    Icon14: "NewIcon14",
    Icon15: "NewIcon15",
  },
};

function applyMigrateIconTransform(source: string) {
  return applyTransform(
    migrateIcons,
    { migrationOptions: testOptions },
    { path: "path/to/file", source },
    { parser: "tsx" },
  );
}

describe("migrate-icons", () => {
  test("", () => {
    const input = `import { Icon1, Icon2, Icon3 } from "@scope/some-old-package";`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(
      `"import { NewIcon1, NewIcon2, NewIcon3 } from "@scope/some-new-package";"`,
    );
  });
});
