import { describe, expect, it } from "bun:test";
import { renderWithHandler } from "../render-test-utils";
import { componentExampleHandler } from "./component-example";

const render = (mdx: string) => renderWithHandler(componentExampleHandler, mdx);

const CODE = [
  "```tsx",
  'import { ActionButton } from "seed-design/ui/action-button";',
  "",
  "export default function ActionButtonPreview() {",
  "  return <ActionButton>라벨</ActionButton>;",
  "}",
  "```",
].join("\n");

const indented = (code: string) =>
  code
    .split("\n")
    .map((line) => (line ? `  ${line}` : line))
    .join("\n");

describe("componentExample handler", () => {
  it("adds a Preview heading when name ends with /preview", async () => {
    const actual = await render(
      `<ComponentExample name="react/action-button/preview">\n${indented(CODE)}\n</ComponentExample>`,
    );

    expect(actual).toBe(`## Preview\n\n${CODE}`);
  });

  it("unwraps a non-preview example without adding a heading", async () => {
    const actual = await render(
      `<ComponentExample name="react/action-button/brand-solid">\n${indented(CODE)}\n</ComponentExample>`,
    );

    expect(actual).toBe(CODE);
  });

  it("keeps the heading for a self-closing preview, which has no code to unwrap", async () => {
    expect(await render('<ComponentExample name="react/text/preview" />\n\n본문입니다.')).toBe(
      "## Preview\n\n본문입니다.",
    );
  });

  it("drops a self-closing non-preview example rather than leaving the tag", async () => {
    expect(await render('앞\n\n<ComponentExample name="react/text/usage" />\n\n뒤')).toBe(
      "앞\n\n뒤",
    );
  });

  it("unwraps without a heading when name is missing", async () => {
    expect(await render("<ComponentExample>\n  본문입니다.\n</ComponentExample>")).toBe(
      "본문입니다.",
    );
  });

  it("unwraps without a heading when name is an expression rather than a string", async () => {
    expect(
      await render("<ComponentExample name={preview}>\n  본문입니다.\n</ComponentExample>"),
    ).toBe("본문입니다.");
  });

  it("keeps the surrounding page around an unwrapped example", async () => {
    const actual = await render(
      `## 사용법\n\n<ComponentExample name="react/action-button/preview">\n${indented(CODE)}\n</ComponentExample>\n\n설명입니다.`,
    );

    expect(actual).toBe(`## 사용법\n\n## Preview\n\n${CODE}\n\n설명입니다.`);
  });

  it("keeps multiple children in order", async () => {
    const actual = await render(
      '<ComponentExample name="react/action-button/preview">\n  첫 문단.\n\n  둘째 문단.\n</ComponentExample>',
    );

    expect(actual).toBe("## Preview\n\n첫 문단.\n\n둘째 문단.");
  });

  it("leaves other JSX alone", async () => {
    expect(await render("<Callout>유지됩니다</Callout>")).toContain("<Callout>");
  });

  it("treats a Lynx example the same as a React one", async () => {
    const actual = await render(
      '<LynxComponentExample name="lynx/action-button/preview">\n\n```tsx\nconst a = 1;\n```\n\n</LynxComponentExample>',
    );

    expect(actual).toContain("## Preview");
    expect(actual).toContain("const a = 1;");
    expect(actual).not.toContain("LynxComponentExample");
  });
});
