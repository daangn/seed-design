import { expect, test } from "bun:test";
import type { GeneratedFile } from "../config";
import { jsdoc } from "./jsdoc";

const specDts = (id: string): GeneratedFile => ({
  path: `${id}.d.ts`,
  code: "export declare const vars: {}",
  type: "dts",
  kind: "ComponentSpec",
  id,
});

const plugin = jsdoc({
  target: "ComponentSpec",
  exclude: ["typography"],
  text: "첫 줄입니다.\n둘째 줄입니다.",
  tag: "internal",
});

test("본문 → 빈 줄 → 태그 순서로 조립한다", () => {
  const result = plugin.transform?.(specDts("action-button"), {});

  expect(result).toBe(
    "/**\n * 첫 줄입니다.\n * 둘째 줄입니다.\n *\n * @internal\n */\nexport declare const vars: {}",
  );
});

test("본문이 태그보다 앞에 온다", () => {
  // 태그가 앞이면 TS가 뒤 줄을 태그 부속 텍스트로 파싱해 documentation이 빈다.
  const result = plugin.transform?.(specDts("action-button"), {}) as string;

  expect(result.indexOf("첫 줄입니다")).toBeLessThan(result.indexOf("@internal"));
});

test("exclude된 id는 통과시킨다", () => {
  expect(plugin.transform?.(specDts("typography"), {})).toBeUndefined();
});

test("include가 있으면 그 목록만 대상이다", () => {
  const scoped = jsdoc({ target: "ComponentSpec", include: ["badge"], text: "본문" });

  expect(scoped.transform?.(specDts("badge"), {})).toBeDefined();
  expect(scoped.transform?.(specDts("chip"), {})).toBeUndefined();
});

test("dts가 아니거나 id가 없는 파일은 통과시킨다", () => {
  expect(plugin.transform?.({ ...specDts("badge"), type: "mjs" }, {})).toBeUndefined();
  expect(plugin.transform?.({ ...specDts("badge"), id: undefined }, {})).toBeUndefined();
  expect(plugin.transform?.({ ...specDts("badge"), kind: "Tokens" }, {})).toBeUndefined();
});

test("tag 없이 본문만으로도 조립한다", () => {
  const noTag = jsdoc({ target: "ComponentSpec", text: "본문만" });

  expect(noTag.transform?.(specDts("badge"), {})).toBe(
    "/**\n * 본문만\n */\nexport declare const vars: {}",
  );
});

test("잘못된 옵션은 팩토리에서 즉시 던진다", () => {
  expect(() => jsdoc({ target: "ComponentSpec", text: "" })).toThrow("text");
  expect(() => jsdoc({ target: "ComponentSpec", text: "본문", tag: "@internal" })).toThrow("@");
});
