import { describe, expect, it } from "bun:test";
import { resolveSeedVersion } from "../utils/registry-source";

describe("resolveSeedVersion", () => {
  it("지원하는 버전을 아카이브 baseUrl로 해석한다", () => {
    expect(resolveSeedVersion({ seedReactVersion: "1.0" })).toEqual({
      framework: "react",
      baseUrl: "https://v1-0.seed-design.io",
    });
    expect(resolveSeedVersion({ seedReactVersion: "1.2" })).toEqual({
      framework: "react",
      baseUrl: "https://v1-2.seed-design.io",
    });
  });

  it("버전이 없으면 null을 반환한다", () => {
    expect(resolveSeedVersion({})).toBeNull();
  });

  it("지원하지 않는 버전이면 에러를 던진다", () => {
    expect(() => resolveSeedVersion({ seedReactVersion: "9.9" })).toThrow();
  });

  it("지원하는 버전과 정확히 같지 않은 값은 공백이나 빈 값이라도 지원하지 않는 버전으로 본다", () => {
    for (const seedReactVersion of [" 1.2", "1.2 ", ""]) {
      expect(() => resolveSeedVersion({ seedReactVersion })).toThrow(
        "지원하지 않는 SEED React 버전",
      );
    }
  });
});
