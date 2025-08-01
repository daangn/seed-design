import { describe, it, expect } from "vitest";
import { createWriterContext } from "../cli/write";

describe("writers", () => {
  describe("createWriterContext", () => {
    const absoluteDir = "/absolute/dir";

    describe("utils", () => {
      it("toJson should stringify data with pretty print by default", () => {
        const context = createWriterContext(absoluteDir);
        const data = { key: "value", nested: { prop: 1 } };

        const result = context.utils.toJson(data);
        expect(result).toBe(JSON.stringify(data, null, 2));
      });

      it("toJson should stringify data without pretty print when false", () => {
        const context = createWriterContext(absoluteDir);
        const data = { key: "value" };

        const result = context.utils.toJson(data, false);
        expect(result).toBe(JSON.stringify(data));
      });

      it("toTypeScript should generate TypeScript const export", () => {
        const context = createWriterContext(absoluteDir);
        const name = "myData";
        const data = { key: "value" };

        const result = context.utils.toTypeScript(name, data);
        expect(result).toBe(`export const ${name} = ${JSON.stringify(data, null, 2)} as const;\n`);
      });

      it("toMjs should generate JavaScript module export", () => {
        const context = createWriterContext(absoluteDir);
        const name = "myData";
        const data = { key: "value" };

        const result = context.utils.toMjs(name, data);
        expect(result).toBe(`export const ${name} = ${JSON.stringify(data, null, 2)};\n`);
      });

      it("toDts should generate TypeScript declaration", () => {
        const context = createWriterContext(absoluteDir);
        const name = "myData";
        const data = { key: "value" };

        const result = context.utils.toDts(name, data);
        expect(result).toBe(`export declare const ${name}: ${JSON.stringify(data, null, 2)};\n`);
      });
    });
  });
});
