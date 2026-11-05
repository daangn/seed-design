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

  it("여러 XElement 이름을 허용한다", () => {
    const compatibility = {
      engine: "2.5",
      "x-elements": ["viewpager", "viewpager-item"],
    };

    expect(lynxCompatibilitySchema.parse(compatibility)).toEqual(compatibility);
  });

  it("Engine 버전이 없거나 XElement 값이 비어 있으면 거부한다", () => {
    expect(
      lynxCompatibilitySchema.safeParse({
        "x-elements": ["input"],
      }).success,
    ).toBe(false);
    expect(
      lynxCompatibilitySchema.safeParse({
        engine: "2.5",
        "x-elements": [""],
      }).success,
    ).toBe(false);
  });

  it("숫자 점 표기법이 아닌 Engine 버전을 거부한다", () => {
    for (const engine of ["2.x", "3.6.0-beta.1"]) {
      expect(lynxCompatibilitySchema.safeParse({ engine }).success).toBe(false);
    }
  });

  it("중복된 XElement를 거부한다", () => {
    expect(
      lynxCompatibilitySchema.safeParse({
        engine: "2.5",
        "x-elements": ["input", "input"],
      }).success,
    ).toBe(false);
  });

  it("버전 객체 형식의 XElement를 거부한다", () => {
    expect(
      lynxCompatibilitySchema.safeParse({
        engine: "2.5",
        "x-elements": [{ name: "input", version: "3.6" }],
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

  it("잘못된 Engine 버전은 SEED 최소 지원 버전으로 보정한다", () => {
    expect(getEffectiveLynxCompatibility({ engine: "2.x" })).toEqual({
      engine: MINIMUM_SUPPORTED_LYNX_ENGINE_VERSION,
    });
  });
});

describe("getLynxCompatibilityMarkdown", () => {
  it("Engine 최소 버전과 사용 XElement를 줄 단위로 출력한다", () => {
    expect(
      getLynxCompatibilityMarkdown({
        engine: "2.5",
        "x-elements": ["viewpager", "viewpager-item"],
      }),
    ).toBe("Lynx Engine 최소 버전: 3.6\n사용 XElement: <viewpager>, <viewpager-item>");
  });
});
