import { describe, expect, it } from "bun:test";
import type { DocEntry, GeneratedDoc } from "fumadocs-typescript";
import { renderTypeTableMarkdown } from "./type-table";

const entry = (overrides: Partial<DocEntry>): DocEntry => ({
  name: "value",
  description: "",
  type: "string",
  simplifiedType: "string",
  tags: [],
  required: false,
  deprecated: false,
  ...overrides,
});

const doc = (...entries: DocEntry[]): GeneratedDoc => ({
  id: "TestProps",
  name: "TestProps",
  description: "",
  entries,
});

describe("renderTypeTableMarkdown", () => {
  it("turns each entry into a prop item with its fields nested underneath", () => {
    const actual = renderTypeTableMarkdown(
      doc(
        entry({
          name: "variant",
          description: "Works only when `variant` is `ghost`.",
          tags: [{ name: "default", text: '"brandSolid"' }],
          type: '"brandSolid" | "ghost" | undefined',
          simplifiedType: '"brandSolid" | "ghost"',
        }),
        entry({
          name: "disabled",
          description: "버튼의 비활성화 여부를 나타냅니다.",
          tags: [{ name: "default", text: "false" }],
          type: "boolean | undefined",
          simplifiedType: "boolean",
        }),
      ),
    );

    expect(actual).toBe(
      [
        "- `variant`",
        '  - type: `"brandSolid" | "ghost" | undefined`',
        '  - default: `"brandSolid"`',
        "  - description: Works only when `variant` is `ghost`.",
        "- `disabled`",
        "  - type: `boolean | undefined`",
        "  - default: `false`",
        "  - description: 버튼의 비활성화 여부를 나타냅니다.",
      ].join("\n"),
    );
  });

  it("shows required and deprecated as fields of their own", () => {
    const actual = renderTypeTableMarkdown(
      doc(
        entry({ name: "children", type: "ReactNode", simplifiedType: "ReactNode", required: true }),
        entry({ name: "legacy", type: "string | undefined", deprecated: true }),
      ),
    );

    expect(actual).toBe(
      [
        "- `children`",
        "  - type: `ReactNode`",
        "  - required: `true`",
        "- `legacy`",
        "  - type: `string | undefined`",
        "  - deprecated: `true`",
      ].join("\n"),
    );
  });

  it("omits an empty description", () => {
    expect(renderTypeTableMarkdown(doc(entry({ required: true })))).toBe(
      "- `value`\n  - type: `string`\n  - required: `true`",
    );
  });

  // The old rule emitted text nodes and let remark escape them, so a description came out
  // as `snake\_case`. Writing the markdown here leaves it as the author typed it.
  it("leaves markdown punctuation in a description unescaped", () => {
    const actual = renderTypeTableMarkdown(
      doc(entry({ description: "snake_case 와 *별표* 를 그대로 둡니다." })),
    );

    expect(actual).toBe(
      "- `value`\n  - type: `string`\n  - description: snake_case 와 *별표* 를 그대로 둡니다.",
    );
  });

  it("reads the default from a `defaultValue` tag too", () => {
    const actual = renderTypeTableMarkdown(
      doc(entry({ tags: [{ name: "defaultValue", text: "false" }] })),
    );

    expect(actual).toBe("- `value`\n  - type: `string`\n  - default: `false`");
  });

  it("collapses a description that runs over several lines", () => {
    const actual = renderTypeTableMarkdown(
      doc(entry({ description: "  첫 줄입니다.\n\n  둘째 줄입니다.  " })),
    );

    expect(actual).toBe(
      "- `value`\n  - type: `string`\n  - description: 첫 줄입니다. 둘째 줄입니다.",
    );
  });

  it("widens the fence around a type that holds backticks", () => {
    // A template literal type — the everyday way a backtick lands inside `type`.
    expect(renderTypeTableMarkdown(doc(entry({ type: "`px` | `rem`" })))).toBe(
      "- `value`\n  - type: `` `px` | `rem` ``",
    );
  });

  // The caller puts the tag back in its place. Returning an empty string here would read
  // as a rendered-but-empty table rather than as nothing to render.
  it("renders nothing for a doc that holds no entries", () => {
    expect(renderTypeTableMarkdown(doc())).toBeUndefined();
  });
});
