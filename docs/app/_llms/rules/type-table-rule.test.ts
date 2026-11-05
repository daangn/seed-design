import { describe, expect, it } from "bun:test";
import { remark } from "remark";
import { docToMdastList } from "./type-table-rule";

function toMarkdown(doc: Parameters<typeof docToMdastList>[0]): string {
  const list = docToMdastList(doc);
  return remark()
    .stringify({ type: "root", children: [list] })
    .trim();
}

describe("typeTableRule", () => {
  it("converts entries to readable markdown list", () => {
    const result = toMarkdown({
      id: "ActionButtonProps",
      name: "ActionButtonProps",
      description: "",
      entries: [
        {
          name: "variant",
          description: "Works only when `variant` is `ghost`.",
          tags: [{ name: "default", text: '"brandSolid"' }],
          type: '"brandSolid" | "ghost" | undefined',
          simplifiedType: '"brandSolid" | "ghost"',
          required: false,
          deprecated: false,
        },
        {
          name: "disabled",
          description: "버튼의 비활성화 여부를 나타냅니다.",
          tags: [{ name: "default", text: "false" }],
          type: "boolean | undefined",
          simplifiedType: "boolean",
          required: false,
          deprecated: false,
        },
      ],
    });

    expect(result).toMatchInlineSnapshot(`
      "* \`variant\`
        * type: \`"brandSolid" | "ghost" | undefined\`
        * default: \`"brandSolid"\`
        * description: Works only when \\\`variant\\\` is \\\`ghost\\\`.
      * \`disabled\`
        * type: \`boolean | undefined\`
        * default: \`false\`
        * description: 버튼의 비활성화 여부를 나타냅니다."
    `);
  });

  it("shows required and deprecated fields", () => {
    const result = toMarkdown({
      id: "TestProps",
      name: "TestProps",
      description: "",
      entries: [
        {
          name: "children",
          description: "",
          tags: [],
          type: "ReactNode",
          simplifiedType: "ReactNode",
          required: true,
          deprecated: false,
        },
        {
          name: "legacy",
          description: "",
          tags: [],
          type: "string | undefined",
          simplifiedType: "string",
          required: false,
          deprecated: true,
        },
      ],
    });

    expect(result).toMatchInlineSnapshot(`
      "* \`children\`
        * type: \`ReactNode\`
        * required: \`true\`
      * \`legacy\`
        * type: \`string | undefined\`
        * deprecated: \`true\`"
    `);
  });

  it("omits empty description", () => {
    const result = toMarkdown({
      id: "TestProps",
      name: "TestProps",
      description: "",
      entries: [
        {
          name: "value",
          description: "",
          tags: [],
          type: "string",
          simplifiedType: "string",
          required: true,
          deprecated: false,
        },
      ],
    });

    expect(result).toMatchInlineSnapshot(`
      "* \`value\`
        * type: \`string\`
        * required: \`true\`"
    `);
  });
});
