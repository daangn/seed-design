import { describe, expect, it } from "bun:test";
import { updatesFrontmatterSchema } from "./updates-frontmatter";

describe("updates frontmatter schema", () => {
  it("release는 description 없이 허용하고 post는 description을 요구한다", () => {
    expect(
      updatesFrontmatterSchema.safeParse({ title: "Release", category: "release" }).success,
    ).toBe(true);
    expect(updatesFrontmatterSchema.safeParse({ title: "Post", category: "post" }).success).toBe(
      false,
    );
  });
});
