import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type {
  MdxJsxAttribute,
  MdxJsxAttributeValueExpression,
  MdxJsxFlowElement,
} from "mdast-util-mdx-jsx";
import type { Exchange } from "@seed-design/rootage-core";
import index from "@seed-design/rootage-artifacts/index.json";
import type { Rule } from "./types";
import {
  type ArrayExpressionNode,
  type ExpressionStatementNode,
  type LiteralNode,
  isProgramNode,
  isStringLiteral,
} from "./estree-utils";

/*
  <ComponentSpecBlock id="action-button" variants={["variant=brandSolid"]} /> 에서
  variants 배열을 파싱합니다.
*/
function getVariantsFromNode(node: MdxJsxFlowElement): string[] {
  const attr = node.attributes.find(
    (a): a is MdxJsxAttribute => a.type === "mdxJsxAttribute" && a.name === "variants",
  );
  if (!attr || typeof attr.value !== "object" || !attr.value) return [];

  const attrValue = attr.value as MdxJsxAttributeValueExpression;
  const estree = attrValue.data?.estree;
  if (!isProgramNode(estree)) return [];

  const stmt = estree.body[0];
  if (!stmt || stmt.type !== "ExpressionStatement") return [];

  const expr = (stmt as ExpressionStatementNode).expression;
  if (expr.type !== "ArrayExpression") return [];

  return (expr as ArrayExpressionNode).elements
    .filter((el): el is LiteralNode & { value: string } => isStringLiteral(el))
    .map((el) => el.value);
}

/*
  MDX의 variants prop ["variant=brandSolid"] 형식과
  JSON의 variants 객체 { "variant": "brandSolid" }를 비교합니다.
*/
function matchesVariantFilter(
  defVariants: Record<string, string>,
  filterVariants: string[],
): boolean {
  if (filterVariants.length === 0) return true;

  const filterMap: Record<string, string> = {};
  for (const f of filterVariants) {
    const eqIdx = f.indexOf("=");
    if (eqIdx < 0) continue;
    filterMap[f.slice(0, eqIdx)] = f.slice(eqIdx + 1);
  }

  // filterMap의 모든 키/값이 defVariants와 일치해야 함
  for (const [k, v] of Object.entries(filterMap)) {
    if (defVariants[k] !== v) return false;
  }
  return true;
}

function stringifyVariants(variants: Record<string, string>): string {
  const entries = Object.entries(variants);
  if (entries.length === 0) return "Base";
  return entries.map(([k, v]) => `${k}=${v}`).join(", ");
}

function formatPropertyValue(prop: Exchange.Value): string {
  // 토큰 참조 ($color.bg.brand-solid 등)는 그대로 표시
  if (typeof prop.value === "string") return prop.value;
  return JSON.stringify(prop.value);
}

/*
  ComponentSpec 데이터를 마크다운 테이블로 변환합니다.
  filterVariants가 비어있으면 모든 definition을 포함합니다.
*/
function generateMarkdown(spec: Exchange.ComponentSpecModel, filterVariants: string[]): string {
  const sections: string[] = [];

  for (const defEntry of spec.data.definitions) {
    if (!matchesVariantFilter(defEntry.variants, filterVariants)) continue;

    const variantLabel = stringifyVariants(defEntry.variants);
    const rows: string[] = [];

    for (const stateDef of defEntry.definitions) {
      const stateStr = stateDef.states.join(", ");
      for (const [slotName, slotProps] of Object.entries(stateDef.slots)) {
        for (const [propName, propValue] of Object.entries(slotProps)) {
          rows.push(
            `| ${stateStr} | ${slotName} | ${propName} | ${formatPropertyValue(propValue)} |`,
          );
        }
      }
    }

    if (rows.length === 0) continue;

    const table = [
      "| State | Slot | Property | Value |",
      "| --- | --- | --- | --- |",
      ...rows,
    ].join("\n");

    sections.push(`### ${variantLabel}\n\n${table}`);
  }

  return sections.join("\n\n");
}

/*
  rootage component spec 파일을 id를 키로 캐싱합니다.
*/
let specDataCache: Map<string, Exchange.ComponentSpecModel> | null = null;

function loadComponentSpecData(): Map<string, Exchange.ComponentSpecModel> {
  if (specDataCache) return specDataCache;

  specDataCache = new Map();
  const rootageDir = join(
    dirname(createRequire(import.meta.url).resolve("@seed-design/rootage-artifacts/package.json")),
    "dist",
  );

  for (const resource of index.resources) {
    const { path } = resource;
    if (!path.startsWith("/components/")) continue;

    try {
      const content = readFileSync(join(rootageDir, path.slice(1)), "utf-8");
      const data = JSON.parse(content) as Exchange.ComponentSpecModel;
      const id = data.metadata?.id ?? path.replace("/components/", "").replace(".json", "");
      specDataCache.set(id, data);
    } catch {
      // 읽지 못한 파일은 건너뜀
    }
  }

  return specDataCache;
}

export const componentSpecBlockRule: Rule = {
  name: "ComponentSpecBlock",
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "ComponentSpecBlock",
  transform: (node, context) => {
    try {
      const id = context.getStringAttribute(node, "id");
      if (!id) throw new Error("ComponentSpecBlock: id prop is required");

      const filterVariants = getVariantsFromNode(node);
      const specData = loadComponentSpecData();
      const spec = specData.get(id);
      if (!spec) throw new Error(`ComponentSpecBlock: spec not found for id="${id}"`);

      const markdown = generateMarkdown(spec, filterVariants);
      if (!markdown) throw new Error(`ComponentSpecBlock: no definitions for id="${id}"`);

      return [{ type: "html", value: markdown }];
    } catch (e) {
      console.warn(`[ComponentSpecBlock] 변환 실패, 노드 스킵: ${e}`);
      return [];
    }
  },
};
