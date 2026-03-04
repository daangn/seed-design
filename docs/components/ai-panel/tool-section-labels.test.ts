import { describe, expect, it } from "bun:test";
import { stripToolSectionLabels } from "./tool-section-labels";

describe("stripToolSectionLabels", () => {
  it("removes bold installation labels", () => {
    const input = "**설치:**\n아래 명령어를 실행하세요.";
    const output = stripToolSectionLabels(input);

    expect(output).toBe("아래 명령어를 실행하세요.");
  });

  it("removes plain installation labels", () => {
    const input = "설치:\n내용";
    const output = stripToolSectionLabels(input);

    expect(output).toBe("내용");
  });

  it("removes markdown preview heading labels", () => {
    const input = "### 사용 예시\n샘플 설명";
    const output = stripToolSectionLabels(input);

    expect(output).toBe("샘플 설명");
  });
});
