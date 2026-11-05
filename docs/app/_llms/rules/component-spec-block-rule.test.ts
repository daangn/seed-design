import { describe, expect, it } from "bun:test";
import index from "@seed-design/rootage-artifacts/index.json";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import {
  type SpecResource,
  componentSpecBlockRule,
  findSpecUrl,
} from "./component-spec-block-rule";

// 실제 rootage index 대신 쓰는 합성 리소스. 스펙 id를 바꾸거나 지워도 이 기대값은 흔들리지 않는다.
const resources: SpecResource[] = [
  { path: "/components/synthetic-chip.json" },
  { path: "/components/synthetic-button.json" },
  { path: "/color.json" },
];

function firstComponentSpecId(candidates: readonly SpecResource[]): string {
  for (const { path } of candidates) {
    const matched = /^\/components\/(.+)\.json$/.exec(path);
    if (matched) return matched[1];
  }
  throw new Error("rootage index에 컴포넌트 스펙 리소스가 하나도 없습니다.");
}

describe("findSpecUrl", () => {
  it("mounts the matching component resource path under /rootage", () => {
    expect(findSpecUrl(resources, "synthetic-chip")).toBe(
      "/rootage/components/synthetic-chip.json",
    );
  });

  it("returns null when no component resource carries the id", () => {
    expect(findSpecUrl(resources, "does-not-exist")).toBeNull();
  });

  // components 밖 리소스까지 잡히면 토큰 JSON을 컴포넌트 스펙이라고 안내하게 된다.
  it("returns null for an id that only matches a resource outside /components", () => {
    expect(findSpecUrl(resources, "color")).toBeNull();
  });
});

describe("componentSpecBlockRule", () => {
  it("keeps the original node when the id prop is missing", () => {
    const actual = normalizeLLMBodyWithRules("<ComponentSpecBlock />", [componentSpecBlockRule]);

    expect(actual).toMatchInlineSnapshot(`"<ComponentSpecBlock />"`);
  });

  it("keeps the original node when no spec resource matches the id", () => {
    const actual = normalizeLLMBodyWithRules(`<ComponentSpecBlock id="does-not-exist" />`, [
      componentSpecBlockRule,
    ]);

    expect(actual).toMatchInlineSnapshot(`"<ComponentSpecBlock id="does-not-exist" />"`);
  });

  // 실제 index에 묶이는 유일한 단언이라, 특정 컴포넌트가 아니라 index에서 뽑아온 id로 본다.
  it("replaces the block with the spec url and drops the variants prop", () => {
    const id = firstComponentSpecId(index.resources);

    const actual = normalizeLLMBodyWithRules(
      `<ComponentSpecBlock id="${id}" variants={["variant=brandSolid", "size=medium"]} />`,
      [componentSpecBlockRule],
    );

    expect(actual).toBe(`Component spec (JSON): /rootage/components/${id}.json`);
  });
});
