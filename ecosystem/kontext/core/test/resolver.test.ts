import { describe, expect, test } from "bun:test";
import { expandTemplate, hasTemplate } from "../src/resolver.js";

describe("expandTemplate", () => {
  test("replaces {id} with kebab-case", () => {
    expect(expandTemplate("packages/css/recipes/{id}.ts", "action-button")).toBe(
      "packages/css/recipes/action-button.ts",
    );
  });

  test("replaces {Id} with PascalCase", () => {
    expect(expandTemplate("src/components/{Id}/", "action-button")).toBe(
      "src/components/ActionButton/",
    );
  });

  test("replaces both {id} and {Id} in same string", () => {
    expect(expandTemplate("docs/{Id}/{id}.mdx", "radio-group")).toBe(
      "docs/RadioGroup/radio-group.mdx",
    );
  });

  test("replaces multiple {id} occurrences", () => {
    expect(expandTemplate("{id}/{id}.ts", "foo")).toBe("foo/foo.ts");
  });

  test("returns unchanged string without templates", () => {
    expect(expandTemplate("packages/css/vars/", "button")).toBe("packages/css/vars/");
  });

  test("handles single-word id", () => {
    expect(expandTemplate("{Id}", "badge")).toBe("Badge");
    expect(expandTemplate("{id}", "badge")).toBe("badge");
  });

  test("handles multi-segment kebab-case", () => {
    expect(expandTemplate("{Id}", "inline-banner")).toBe("InlineBanner");
    expect(expandTemplate("{Id}", "bottom-sheet-close-button")).toBe("BottomSheetCloseButton");
  });
});

describe("hasTemplate", () => {
  test("detects {id}", () => {
    expect(hasTemplate("packages/{id}.ts")).toBe(true);
  });

  test("detects {Id}", () => {
    expect(hasTemplate("src/{Id}/")).toBe(true);
  });

  test("returns false without template", () => {
    expect(hasTemplate("packages/css/vars/")).toBe(false);
    expect(hasTemplate("plain-string")).toBe(false);
  });
});
