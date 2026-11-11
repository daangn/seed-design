import { describe, expect, test } from "bun:test";
import { serializeProps } from "astro/runtime/server/serialize.js";
import { reviveIslandProps } from "./astro-island-props";

// Astro 내부 직렬화 형식에 기대는 코드라, Astro를 올려 형식이 바뀌면 여기서 실패해야 한다.
describe("reviveIslandProps", () => {
  test("Astro가 직렬화한 props를 같은 값으로 되살린다", () => {
    const props = {
      pathname: "/react/components/checkbox",
      sidebar: false,
      missing: undefined,
      nothing: null,
      page: {
        title: "Checkbox",
        toc: [{ depth: 2, url: "#usage", title: ["Usage ", { code: "size" }] }],
        lastUpdate: new Date("2026-11-11T00:00:00.000Z"),
      },
      pattern: /a+b/,
      map: new Map([["key", { value: 1 }]]),
      set: new Set(["a", "b"]),
      big: BigInt(10),
      url: new URL("https://seed-design.io/react"),
      bytes: new Uint8Array([1, 2]),
      shorts: new Uint16Array([3]),
      words: new Uint32Array([4]),
      infinity: Number.POSITIVE_INFINITY,
      negativeInfinity: Number.NEGATIVE_INFINITY,
    };

    expect(
      reviveIslandProps(serializeProps(props, { displayName: "DocsShell", astroStaticSlot: true })),
    ).toEqual(props);
  });

  test("모르는 형식이면 예외를 던진다", () => {
    expect(() => reviveIslandProps('{"a":[99,1]}')).toThrow();
    expect(() => reviveIslandProps('{"a":1}')).toThrow();
  });
});
