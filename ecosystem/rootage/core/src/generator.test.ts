import { describe, expect, it } from "bun:test";

import { type GeneratorFunction, runGenerator } from "./generator";

describe("runGenerator", () => {
  const ast = { tokens: [], tokenCollections: [] };

  it("passes the AST and options through and returns the generated code", async () => {
    const generator: GeneratorFunction = (input, options) =>
      `${options.prefix}:${input.tokens.length}`;

    expect(await runGenerator(generator, ast, { prefix: "test" })).toBe("test:0");
  });

  it("rejects a generator that does not return a string", async () => {
    // A JavaScript generator escapes the return type, as a parsed array does here.
    const generator: GeneratorFunction = () => JSON.parse("[]");

    await expect(runGenerator(generator, ast, {})).rejects.toThrow();
  });
});
