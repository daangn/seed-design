import { describe, expect, it } from "bun:test";
import { parseLynxExampleManifest } from "./manifest-schema";

describe("parseLynxExampleManifest", () => {
  it("유효한 web·lynx entry를 읽는다", () => {
    expect(
      parseLynxExampleManifest({
        schemaVersion: 1,
        examples: {
          "lynx/badge/preview": {
            web: "/__lynx__/badge/preview.12345678.web.bundle",
            lynx: "/__lynx__/badge/preview.87654321.lynx.bundle",
          },
        },
      }),
    ).toEqual({
      schemaVersion: 1,
      examples: {
        "lynx/badge/preview": {
          web: "/__lynx__/badge/preview.12345678.web.bundle",
          lynx: "/__lynx__/badge/preview.87654321.lynx.bundle",
        },
      },
    });
  });

  it("platform이 뒤바뀐 entry를 거부한다", () => {
    expect(() =>
      parseLynxExampleManifest({
        schemaVersion: 1,
        examples: {
          "lynx/badge/preview": {
            web: "/__lynx__/badge/preview.12345678.lynx.bundle",
            lynx: "/__lynx__/badge/preview.87654321.web.bundle",
          },
        },
      }),
    ).toThrow("lynx/badge/preview의 web bundle platform이 일치하지 않습니다.");
  });
});
