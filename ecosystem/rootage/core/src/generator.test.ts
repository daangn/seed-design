import { describe, expect, it } from "bun:test";

import {
  type ComponentSpecGeneratorFunction,
  type GeneratorFunction,
  runComponentSpecGenerator,
  runGenerator,
} from "./generator";

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

describe("runComponentSpecGenerator", () => {
  const ast = { componentSpecs: [] };
  const options = { prefix: "test", resolveTokenValues: () => undefined };

  it("passes the specs and options through and returns the generated files", async () => {
    const generator: ComponentSpecGeneratorFunction = (input, generatorOptions) => [
      { path: "summary.txt", code: `${generatorOptions.prefix}:${input.componentSpecs.length}` },
    ];

    expect(await runComponentSpecGenerator(generator, ast, options)).toEqual([
      { path: "summary.txt", code: "test:0" },
    ]);
  });

  it("rejects a generator that does not return files", async () => {
    // A JavaScript generator escapes the return type, as a parsed string does here.
    const generator: ComponentSpecGeneratorFunction = () => JSON.parse('"export const vars = {}"');

    await expect(runComponentSpecGenerator(generator, ast, options)).rejects.toThrow();
  });
});
