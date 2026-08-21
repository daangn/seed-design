import { describe, expect, test } from "bun:test";
import { parseRootagePath } from "./request-path";

describe("Rootage 공개 경로", () => {
  test("버전, latest, legacy 경로를 분리한다", () => {
    expect(parseRootagePath("/rootage/v1.2.3/index.json")).toEqual({
      kind: "version",
      version: "1.2.3",
      path: "/index.json",
    });
    expect(parseRootagePath("/rootage/latest/index.json")).toEqual({
      kind: "stable",
      alias: "latest",
      path: "/index.json",
    });
    expect(parseRootagePath("/rootage/index.json")).toEqual({
      kind: "stable",
      alias: "legacy",
      path: "/index.json",
    });
  });

  test("경로 우회와 비 JSON 요청을 거부한다", () => {
    for (const path of [
      "/rootage/v1.2.3/../index.json",
      "/rootage/%2e%2e/index.json",
      "/rootage//index.json",
      "/rootage/file.txt",
    ]) {
      expect(parseRootagePath(path)).toBeNull();
    }
  });
});
