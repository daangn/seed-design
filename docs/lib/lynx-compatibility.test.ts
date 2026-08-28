import { describe, expect, it } from "bun:test";
import {
  getEffectiveLynxCompatibility,
  getLynxCompatibilityMarkdown,
  lynxCompatibilitySchema,
  MINIMUM_SUPPORTED_LYNX_ENGINE_VERSION,
} from "./lynx-compatibility";

describe("lynxCompatibilitySchema", () => {
  it("Engine 최소 버전만 허용한다", () => {
    expect(lynxCompatibilitySchema.parse({ engine: "2.5" })).toEqual({ engine: "2.5" });
  });

  it("여러 XElement의 이름과 최소 버전을 허용한다", () => {
    const compatibility = {
      engine: "2.5",
      "x-elements": [
        { name: "viewpager", version: "2.5.1" },
        { name: "viewpager-item", version: "2.5.1" },
      ],
    };

    expect(lynxCompatibilitySchema.parse(compatibility)).toEqual(compatibility);
  });

  it("Engine 버전이 없거나 XElement 값이 비어 있으면 거부한다", () => {
    expect(
      lynxCompatibilitySchema.safeParse({
        "x-elements": [{ name: "input", version: "3.4" }],
      }).success,
    ).toBe(false);
    expect(
      lynxCompatibilitySchema.safeParse({
        engine: "2.5",
        "x-elements": [{ name: "", version: "" }],
      }).success,
    ).toBe(false);
  });

  it("중복된 XElement를 거부한다", () => {
    expect(
      lynxCompatibilitySchema.safeParse({
        engine: "2.5",
        "x-elements": [
          { name: "input", version: "3.4" },
          { name: "input", version: "3.5" },
        ],
      }).success,
    ).toBe(false);
  });
});

describe("getEffectiveLynxCompatibility", () => {
  it("SEED 최소 지원 버전보다 낮은 Engine 버전을 올린다", () => {
    expect(getEffectiveLynxCompatibility({ engine: "2.5" })).toEqual({
      engine: MINIMUM_SUPPORTED_LYNX_ENGINE_VERSION,
    });
  });

  it("SEED 최소 지원 버전 이상은 그대로 유지한다", () => {
    expect(getEffectiveLynxCompatibility({ engine: "3.9" })).toEqual({ engine: "3.9" });
  });
});

describe("getLynxCompatibilityMarkdown", () => {
  it("Engine과 XElement 최소 버전을 줄 단위로 출력한다", () => {
    expect(
      getLynxCompatibilityMarkdown({
        engine: "2.5",
        "x-elements": [
          { name: "viewpager", version: "2.5.1" },
          { name: "viewpager-item", version: "2.5.1" },
        ],
      }),
    ).toBe("Lynx Engine 최소 버전: 3.6\nXElement 최소 버전: viewpager@2.5.1, viewpager-item@2.5.1");
  });
});
