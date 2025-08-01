import { describe, it, expect } from "vitest";
import { createWriterContext } from "../cli/write";

const context = createWriterContext({ baseDir: "/", pipelineName: "test" });

describe("writers", () => {
  describe("createWriterContext", () => {
    describe("utils", () => {
      it("toJson should stringify data with pretty print by default", () => {
        const data = { key: "value", nested: { prop: 1 } };

        const result = context.utils.toJson(data);
        expect(result).toBe(JSON.stringify(data, null, 2));
      });

      it("toJson should stringify data without pretty print when false", () => {
        const data = { key: "value" };

        const result = context.utils.toJson(data, false);
        expect(result).toBe(JSON.stringify(data));
      });

      it("toTypeScript should generate TypeScript const export", () => {
        const name = "myData";
        const data = { key: "value" };

        const result = context.utils.toTypeScript(name, data);
        expect(result).toBe(`export const ${name} = ${JSON.stringify(data, null, 2)} as const;\n`);
      });

      it("toMjs should generate JavaScript module export", () => {
        const name = "myData";
        const data = { key: "value" };

        const result = context.utils.toMjs(name, data);
        expect(result).toBe(`export const ${name} = ${JSON.stringify(data, null, 2)};\n`);
      });

      it("toDts should generate TypeScript declaration", () => {
        const name = "myData";
        const data = { key: "value" };

        const result = context.utils.toDts(name, data);
        expect(result).toBe(`export declare const ${name}: ${JSON.stringify(data, null, 2)};\n`);
      });
    });
  });
});
