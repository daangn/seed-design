import { describe, expect, it } from "bun:test";
import { readRawOptionValue, resolveSeedVersion } from "../utils/registry-source";

describe("readRawOptionValue", () => {
  it("`--flag value` 형식에서 원본 문자열을 읽는다", () => {
    // CAC는 이 값을 숫자 1로 뭉개지만 rawArgs엔 "1.0"이 그대로 남아있다.
    expect(
      readRawOptionValue(
        ["node", "cli", "add", "--seed-react-version", "1.0"],
        "--seed-react-version",
      ),
    ).toBe("1.0");
  });

  it("`--flag=value` 형식에서 원본 문자열을 읽는다", () => {
    expect(
      readRawOptionValue(
        ["node", "cli", "add", "--seed-react-version=1.2"],
        "--seed-react-version",
      ),
    ).toBe("1.2");
  });

  it("플래그가 없으면 undefined를 반환한다", () => {
    expect(readRawOptionValue(["node", "cli", "add"], "--seed-react-version")).toBeUndefined();
  });
});

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
});
