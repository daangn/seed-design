import { describe, expect, it } from "bun:test";
import { createE2EManifest } from "./e2e-manifest.js";

describe("createE2EManifest", () => {
  it("예제마다 Probelynx ID로 같은 컴포넌트의 lynx bundle과 예제·E2E query를 연결한다", () => {
    const badge = {
      web: "/__lynx__/badge.12345678.web.bundle",
      lynx: "/__lynx__/badge.87654321.lynx.bundle",
    };
    const helpBubble = {
      web: "/__lynx__/help-bubble.aaaaaaaa.web.bundle",
      lynx: "/__lynx__/help-bubble.bbbbbbbb.lynx.bundle",
    };

    expect(
      createE2EManifest({
        schemaVersion: 1,
        examples: {
          "lynx/badge/preview": badge,
          "lynx/badge/size": badge,
          "lynx/help-bubble/default-open": helpBubble,
        },
      }),
    ).toEqual({
      schemaVersion: 1,
      examples: {
        "badge.preview": {
          lynx: "/__lynx__/badge.87654321.lynx.bundle",
          query: "example=lynx%2Fbadge%2Fpreview&e2e=1",
        },
        "badge.size": {
          lynx: "/__lynx__/badge.87654321.lynx.bundle",
          query: "example=lynx%2Fbadge%2Fsize&e2e=1",
        },
        "help-bubble.default-open": {
          lynx: "/__lynx__/help-bubble.bbbbbbbb.lynx.bundle",
          query: "example=lynx%2Fhelp-bubble%2Fdefault-open&e2e=1",
        },
      },
    });
  });

  it("Probelynx ID 규칙을 만족하지 못하는 예제 ID를 거부한다", () => {
    const bundle = { web: "/__lynx__/badge.web.bundle", lynx: "/__lynx__/badge.lynx.bundle" };

    expect(() =>
      createE2EManifest({ schemaVersion: 1, examples: { "lynx/Badge/preview": bundle } }),
    ).toThrow("Probelynx ID로 바꿀 수 없는 Lynx 예제 ID입니다: lynx/Badge/preview");
  });
});
