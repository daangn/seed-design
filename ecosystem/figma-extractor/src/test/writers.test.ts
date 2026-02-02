import { describe, it, expect, mock } from "bun:test";
import { createWriterContext, type WriterContext } from "../cli/write";
import { writers, getFileName, getIdentifierName } from "../pipeline/writers";

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

  describe("default writer", () => {
    it("should generate correct file structure", async () => {
      const writes: Record<string, string> = {};
      const mockContext = {
        ...context,
        write: mock(async (path: string, content: string) => {
          writes[path] = content;
        }),
      };

      const items = [
        { name: "Button Component", type: "component" },
        { name: "Card/Header", description: "Card header component" },
        { name: "nav-menu", variant: "primary" },
      ];

      await writers.default(items, mockContext);

      expect(writes).toMatchInlineSnapshot(`
        {
          "test/button-component.d.ts": 
        "export declare const metadata: {
          "name": "Button Component",
          "type": "component"
        };
        "
        ,
          "test/button-component.mjs": 
        "export const metadata = {
          "name": "Button Component",
          "type": "component"
        };
        "
        ,
          "test/card-header.d.ts": 
        "export declare const metadata: {
          "name": "Card/Header",
          "description": "Card header component"
        };
        "
        ,
          "test/card-header.mjs": 
        "export const metadata = {
          "name": "Card/Header",
          "description": "Card header component"
        };
        "
        ,
          "test/index.d.ts": 
        "export { metadata as buttonComponent } from "./button-component";
        export { metadata as cardHeader } from "./card-header";
        export { metadata as navMenu } from "./nav-menu";
        "
        ,
          "test/index.mjs": 
        "export { metadata as buttonComponent } from "./button-component.mjs";
        export { metadata as cardHeader } from "./card-header.mjs";
        export { metadata as navMenu } from "./nav-menu.mjs";
        "
        ,
          "test/nav-menu.d.ts": 
        "export declare const metadata: {
          "name": "nav-menu",
          "variant": "primary"
        };
        "
        ,
          "test/nav-menu.mjs": 
        "export const metadata = {
          "name": "nav-menu",
          "variant": "primary"
        };
        "
        ,
        }
      `);
    });

    it("should handle empty items", async () => {
      const writes: Record<string, string> = {};
      const mockContext = {
        ...context,
        write: mock(async (path: string, content: string) => {
          writes[path] = content;
        }),
      };

      await writers.default([], mockContext);

      expect(writes).toMatchInlineSnapshot(`
        {
          "test/index.d.ts": 
        "
        "
        ,
          "test/index.mjs": 
        "
        "
        ,
        }
      `);
    });
  });

  describe("custom writer example", () => {
    it("should work with custom writer that aggregates items", async () => {
      const writes: Record<string, string> = {};
      const mockContext = {
        ...context,
        write: mock(async (path: string, content: string) => {
          writes[path] = content;
        }),
      };

      const customWriter = async <T extends { name: string }>(
        items: T[],
        { pipelineName, utils, write }: WriterContext,
      ) => {
        const data = items.reduce(
          (acc, item) => {
            const key = getIdentifierName(item.name);
            acc[key] = item;

            return acc;
          },
          {} as Record<string, T>,
        );

        await write(`${pipelineName}/data.json`, utils.toJson(data));
        await write(`${pipelineName}/index.ts`, utils.toTypeScript("data", data));
        await write(`${pipelineName}/index.d.ts`, utils.toDts("data", data));
        await write(`${pipelineName}/index.mjs`, utils.toMjs("data", data));
      };

      const items = [
        { name: "Button", type: "component" },
        { name: "Card Header", description: "Header component" },
      ];

      await customWriter(items, mockContext);

      expect(writes).toMatchInlineSnapshot(`
        {
          "test/data.json": 
        "{
          "button": {
            "name": "Button",
            "type": "component"
          },
          "cardHeader": {
            "name": "Card Header",
            "description": "Header component"
          }
        }"
        ,
          "test/index.d.ts": 
        "export declare const data: {
          "button": {
            "name": "Button",
            "type": "component"
          },
          "cardHeader": {
            "name": "Card Header",
            "description": "Header component"
          }
        };
        "
        ,
          "test/index.mjs": 
        "export const data = {
          "button": {
            "name": "Button",
            "type": "component"
          },
          "cardHeader": {
            "name": "Card Header",
            "description": "Header component"
          }
        };
        "
        ,
          "test/index.ts": 
        "export const data = {
          "button": {
            "name": "Button",
            "type": "component"
          },
          "cardHeader": {
            "name": "Card Header",
            "description": "Header component"
          }
        } as const;
        "
        ,
        }
      `);
    });
  });

  describe("getFileName", () => {
    it("should convert names to kebab-case", () => {
      expect(getFileName("Button Component")).toBe("button-component");
      expect(getFileName("Card/Header")).toBe("card-header");
      expect(getFileName("nav menu")).toBe("nav-menu");
      expect(getFileName("SimpleText")).toBe("simple-text");
    });

    it("should handle spaces and slashes", () => {
      expect(getFileName("Component / With / Slashes")).toBe("component-with-slashes");
      expect(getFileName("Multiple   Spaces")).toBe("multiple-spaces");
    });

    it("should handle emojis", () => {
      expect(getFileName("Button 🔥")).toBe("button");
      expect(getFileName("Icon ⭐ Star")).toBe("icon-star");
      expect(getFileName("🚀 Rocket Launch")).toBe("rocket-launch");
      expect(getFileName("Heart ❤️ Component")).toBe("heart-component");
    });
  });

  describe("getIdentifierName", () => {
    it("should convert names to camelCase", () => {
      expect(getIdentifierName("Button Component")).toBe("buttonComponent");
      expect(getIdentifierName("Card/Header")).toBe("cardHeader");
      expect(getIdentifierName("nav menu")).toBe("navMenu");
      expect(getIdentifierName("simple-text")).toBe("simpleText");
    });

    it("should handle spaces and slashes", () => {
      expect(getIdentifierName("Component / With / Slashes")).toBe("componentWithSlashes");
      expect(getIdentifierName("Multiple   Spaces")).toBe("multipleSpaces");
    });

    it("should handle emojis", () => {
      expect(getIdentifierName("Button 🔥")).toBe("button");
      expect(getIdentifierName("Icon ⭐ Star")).toBe("iconStar");
      expect(getIdentifierName("🚀 Rocket Launch")).toBe("rocketLaunch");
      expect(getIdentifierName("Heart ❤️ Component")).toBe("heartComponent");
    });
  });
});
