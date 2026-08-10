import { describe, expect, it } from "bun:test";
import { updatesDocs } from "./source.config";

const schema = updatesDocs.docs.schema;

if (!schema || typeof schema === "function") {
  throw new Error("Updates docs must use a static frontmatter schema.");
}

describe("updates frontmatter schema", () => {
  it("release는 description 없이 허용하고 post는 description을 요구한다", () => {
    expect(schema.safeParse({ title: "Release", category: "release" }).success).toBe(true);
    expect(schema.safeParse({ title: "Post", category: "post" }).success).toBe(false);
  });
});
