import { describe, expect, test } from "bun:test";

async function schema(name: string): Promise<Record<string, unknown>> {
  return Bun.file(new URL(`../schemas/${name}`, import.meta.url)).json();
}

function expectPropertyDescriptions(value: unknown): void {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const object = value as Record<string, unknown>;
  const properties = object.properties as Record<string, unknown> | undefined;
  if (properties) {
    for (const property of Object.values(properties)) {
      expect((property as Record<string, unknown>).description).toBeString();
      expectPropertyDescriptions(property);
    }
  }
  const definitions = object.$defs as Record<string, unknown> | undefined;
  if (definitions)
    for (const definition of Object.values(definitions)) expectPropertyDescriptions(definition);
}

describe("Rootage JSON Schema", () => {
  for (const name of ["completion-manifest.schema.json", "stable-pointer.schema.json"]) {
    test(`${name}의 모든 필드에 설명이 있다`, async () => {
      const value = await schema(name);
      expect(value.$schema).toBe("https://json-schema.org/draft/2020-12/schema");
      expectPropertyDescriptions(value);
    });
  }
});
