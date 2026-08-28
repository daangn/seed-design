import { describe, expect, it } from "bun:test";
import { getLynxCompatibilityBlock } from "./get-llm-text";

const compatibility = {
  engine: "2.5",
  "x-elements": ["viewpager"],
};

describe("getLynxCompatibilityBlock", () => {
  it("Lynx 문서에 호환 정보 블록을 출력한다", () => {
    expect(getLynxCompatibilityBlock(compatibility, "lynx")).toBe(
      "Lynx Engine 최소 버전: 3.6\n사용 XElement: <viewpager>\n\n",
    );
  });

  it("다른 섹션이나 호환 정보가 없는 문서에는 출력하지 않는다", () => {
    expect(getLynxCompatibilityBlock(compatibility, "react")).toBe("");
    expect(getLynxCompatibilityBlock(undefined, "lynx")).toBe("");
  });
});
