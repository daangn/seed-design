import { describe, expect, test } from "bun:test";
import { SchemaValidationError, validateConfig } from "../src/schema.js";

describe("validateConfig", () => {
  test("accepts valid minimal config", () => {
    const config = validateConfig(
      {
        apiVersion: "kontext/v1",
        relations: [
          {
            when: "components/*.yaml",
            affects: [{ path: "packages/css/vars/" }],
          },
        ],
      },
      "test.yaml",
    );

    expect(config.apiVersion).toBe("kontext/v1");
    expect(config.relations).toHaveLength(1);
    expect(config.relations[0]!.when).toBe("components/*.yaml");
    expect(config.relations[0]!.affects[0]!.path).toBe("packages/css/vars/");
    expect(config.relations[0]!.affects[0]!.generated).toBe(false);
    expect(config.relations[0]!.affects[0]!.optional).toBe(false);
  });

  test("accepts config with all optional fields", () => {
    const config = validateConfig(
      {
        apiVersion: "kontext/v1",
        ignore: ["**/*.test.ts"],
        relations: [
          {
            when: "src/**",
            exclude: ["*.test.ts"],
            affects: [
              {
                path: "docs/{id}.mdx",
                reason: "docs update",
                generated: true,
                command: "bun generate",
                optional: true,
              },
            ],
            overrides: [
              {
                match: "src/special/*.ts",
                affects: [{ path: "docs/special/{id}.mdx" }],
              },
            ],
          },
        ],
      },
      "test.yaml",
    );

    expect(config.ignore).toEqual(["**/*.test.ts"]);
    expect(config.relations[0]!.exclude).toEqual(["*.test.ts"]);
    expect(config.relations[0]!.affects[0]!.reason).toBe("docs update");
    expect(config.relations[0]!.affects[0]!.generated).toBe(true);
    expect(config.relations[0]!.affects[0]!.command).toBe("bun generate");
    expect(config.relations[0]!.affects[0]!.optional).toBe(true);
    expect(config.relations[0]!.overrides).toHaveLength(1);
    expect(config.relations[0]!.overrides![0]!.match).toBe("src/special/*.ts");
  });

  test("rejects wrong apiVersion", () => {
    expect(() => validateConfig({ apiVersion: "v2", relations: [] }, "test.yaml")).toThrow(
      SchemaValidationError,
    );
  });

  test("rejects missing relations", () => {
    expect(() => validateConfig({ apiVersion: "kontext/v1" }, "test.yaml")).toThrow(
      SchemaValidationError,
    );
  });

  test("rejects non-object root", () => {
    expect(() => validateConfig([], "test.yaml")).toThrow(SchemaValidationError);
    expect(() => validateConfig(null, "test.yaml")).toThrow(SchemaValidationError);
    expect(() => validateConfig("string", "test.yaml")).toThrow(SchemaValidationError);
  });

  test("rejects relation with empty when", () => {
    expect(() =>
      validateConfig(
        {
          apiVersion: "kontext/v1",
          relations: [{ when: "", affects: [{ path: "a" }] }],
        },
        "test.yaml",
      ),
    ).toThrow(SchemaValidationError);
  });

  test("rejects affects entry with empty path", () => {
    expect(() =>
      validateConfig(
        {
          apiVersion: "kontext/v1",
          relations: [{ when: "*.ts", affects: [{ path: "" }] }],
        },
        "test.yaml",
      ),
    ).toThrow(SchemaValidationError);
  });

  test("rejects invalid type for reason", () => {
    expect(() =>
      validateConfig(
        {
          apiVersion: "kontext/v1",
          relations: [{ when: "*.ts", affects: [{ path: "a", reason: 123 }] }],
        },
        "test.yaml",
      ),
    ).toThrow(SchemaValidationError);
  });

  test("error includes file path and issues", () => {
    try {
      validateConfig({ apiVersion: "wrong", relations: [] }, "my/file.yaml");
      expect(true).toBe(false); // should not reach
    } catch (e) {
      expect(e).toBeInstanceOf(SchemaValidationError);
      const err = e as SchemaValidationError;
      expect(err.filePath).toBe("my/file.yaml");
      expect(err.issues.length).toBeGreaterThan(0);
      expect(err.message).toContain("my/file.yaml");
    }
  });
});
