import { describe, expect, test } from "bun:test";
import { kebabToPascal, pascalToKebab } from "../utils/naming";

describe("pascalToKebab", () => {
  test("단일 단어", () => {
    expect(pascalToKebab("Button")).toBe("button");
  });

  test("두 단어", () => {
    expect(pascalToKebab("ActionButton")).toBe("action-button");
  });

  test("연속 대문자", () => {
    expect(pascalToKebab("FABButton")).toBe("fab-button");
  });

  test("세 단어", () => {
    expect(pascalToKebab("ContentPlaceholder")).toBe("content-placeholder");
  });

  test("숫자 포함", () => {
    expect(pascalToKebab("Tab3Panel")).toBe("tab3-panel");
  });
});

describe("kebabToPascal", () => {
  test("단일 단어", () => {
    expect(kebabToPascal("button")).toBe("Button");
  });

  test("두 단어", () => {
    expect(kebabToPascal("action-button")).toBe("ActionButton");
  });

  test("세 단어", () => {
    expect(kebabToPascal("content-placeholder")).toBe("ContentPlaceholder");
  });
});

describe("왕복 변환", () => {
  const cases = [
    ["ActionButton", "action-button"],
    ["Checkbox", "checkbox"],
    ["ContentPlaceholder", "content-placeholder"],
    ["BottomSheet", "bottom-sheet"],
  ] as const;

  for (const [pascal, kebab] of cases) {
    test(`${pascal} ↔ ${kebab}`, () => {
      expect(pascalToKebab(pascal)).toBe(kebab);
      expect(kebabToPascal(kebab)).toBe(pascal);
    });
  }
});
