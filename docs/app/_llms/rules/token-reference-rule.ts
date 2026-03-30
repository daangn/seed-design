import { readFileSync } from "node:fs";
import { join } from "node:path";
import type {
  MdxJsxAttribute,
  MdxJsxAttributeValueExpression,
  MdxJsxFlowElement,
} from "mdast-util-mdx-jsx";
import type { Exchange } from "@seed-design/rootage-core";
import type { Rule } from "./types";
import { markdownRow } from "./markdown-utils";
import {
  type ArrayExpressionNode,
  type ExpressionStatementNode,
  type LiteralNode,
  isProgramNode,
  isRegexLiteral,
  isStringLiteral,
} from "./estree-utils";

/*
  <TokenReference groups={["color", "palette"]} /> 에서 groups 배열을 파싱합니다.
*/
function getGroupsFromNode(node: MdxJsxFlowElement): string[] {
  const attr = node.attributes.find(
    (a): a is MdxJsxAttribute => a.type === "mdxJsxAttribute" && a.name === "groups",
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
  <TokenReference regex={/\$color\..*-pressed$/} /> 에서 regex를 파싱합니다.
*/
function getRegexFromNode(node: MdxJsxFlowElement): RegExp | null {
  const attr = node.attributes.find(
    (a): a is MdxJsxAttribute => a.type === "mdxJsxAttribute" && a.name === "regex",
  );
  if (!attr || typeof attr.value !== "object" || !attr.value) return null;

  const attrValue = attr.value as MdxJsxAttributeValueExpression;
  const estree = attrValue.data?.estree;
  if (!isProgramNode(estree)) return null;

  const stmt = estree.body[0];
  if (!stmt || stmt.type !== "ExpressionStatement") return null;

  const expr = (stmt as ExpressionStatementNode).expression;
  if (!isRegexLiteral(expr)) return null;

  return new RegExp(expr.regex.pattern, expr.regex.flags);
}

interface RootageIndex {
  resources: { path: string }[];
}

/*
  토큰 값을 사람이 읽을 수 있는 문자열로 변환합니다.
*/
function formatTokenValue(entry: Exchange.Value): string {
  switch (entry.type) {
    case "color":
      return entry.value; // ColorLit | TokenRef - 모두 string
    case "dimension": {
      if (typeof entry.value === "string") return entry.value;
      const { value, unit } = entry.value;
      if (unit === "rem") return `${value}rem (${Math.round(value * 16)}px)`;
      return `${value}${unit}`;
    }
    case "duration": {
      if (typeof entry.value === "string") return entry.value;
      return `${entry.value.value}${entry.value.unit}`;
    }
    case "number":
      return String(entry.value);
    case "cubicBezier": {
      if (typeof entry.value === "string") return entry.value;
      return `cubic-bezier(${entry.value.join(", ")})`;
    }
    case "shadow":
    case "gradient":
      if (typeof entry.value === "string") return entry.value;
      return JSON.stringify(entry.value);
  }
}

/*
  rootage 토큰 데이터에서 마크다운 테이블을 생성합니다.
  groups가 ["radius"]이면 "$radius." 로 시작하는 토큰만 포함합니다.
*/
function generateMarkdownTable(
  tokens: Exchange.TokensModel["data"]["tokens"],
  groups: string[],
): string {
  const prefix = `$${groups.join(".")}.`;
  const filtered = Object.entries(tokens).filter(([id]) => id.startsWith(prefix));

  if (filtered.length === 0) return "";

  // 첫 번째 토큰에서 theme(column) 이름 결정
  const themeNames = Object.keys(filtered[0][1].values);

  const headers = ["Token", ...themeNames];
  const separator = headers.map(() => "---");

  const rows = filtered.map(([id, entry]) => {
    const values = themeNames.map((theme) => {
      const val = entry.values[theme];
      return val ? formatTokenValue(val) : "";
    });
    return [id, ...values];
  });

  return [markdownRow(headers), markdownRow(separator), ...rows.map(markdownRow)].join("\n");
}

/*
  rootage 토큰 파일을 경로를 키로 캐싱합니다.
  첫 번째 호출 시 readFileSync로 로드하고 이후에는 캐시를 재사용합니다.
*/
let tokenDataCache: Map<string, Exchange.TokensModel> | null = null;

function loadTokenData(): Map<string, Exchange.TokensModel> {
  if (tokenDataCache) return tokenDataCache;

  tokenDataCache = new Map();
  const rootageDir = join(import.meta.dir, "../../../public/rootage");

  try {
    const indexContent = readFileSync(join(rootageDir, "index.json"), "utf-8");
    const index = JSON.parse(indexContent) as RootageIndex;

    for (const resource of index.resources) {
      const { path } = resource;
      if (path.startsWith("/components/") || path === "/collections.json") continue;

      try {
        const filePath = join(rootageDir, path.slice(1));
        const content = readFileSync(filePath, "utf-8");
        tokenDataCache.set(path, JSON.parse(content) as Exchange.TokensModel);
      } catch {
        // 읽지 못한 파일은 건너뜀
      }
    }
  } catch {
    // index.json 읽기 실패 시 빈 캐시 반환
  }

  return tokenDataCache;
}

export const tokenReferenceRule: Rule = {
  name: "TokenReference",
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "TokenReference",
  transform: (node) => {
    const regex = getRegexFromNode(node);
    const groups = getGroupsFromNode(node);
    const tokenData = loadTokenData();

    if (regex) {
      const matched: { id: string; entry: { values: Record<string, Exchange.Value> } }[] = [];
      for (const data of tokenData.values()) {
        for (const [id, entry] of Object.entries(data.data.tokens)) {
          if (regex.test(id)) matched.push({ id, entry });
        }
      }

      if (matched.length === 0) throw new Error(`No tokens matched regex: ${regex}`);

      const themeNames = Object.keys(matched[0].entry.values);
      const headers = ["Token", ...themeNames];
      const separator = headers.map(() => "---");
      const rows = matched.map(({ id, entry }) => {
        const values = themeNames.map((theme) => {
          const val = entry.values[theme];
          return val ? formatTokenValue(val) : "";
        });
        return [id, ...values];
      });

      const tableMarkdown = [
        markdownRow(headers),
        markdownRow(separator),
        ...rows.map(markdownRow),
      ].join("\n");

      return [{ type: "html", value: tableMarkdown }];
    }

    if (groups.length === 0) {
      const sections: string[] = [];
      for (const data of tokenData.values()) {
        const table = generateMarkdownTable(data.data.tokens, [data.metadata.id]);
        if (table) sections.push(`## ${data.metadata.name}\n\n${table}`);
      }
      const allTables = sections.join("\n\n");
      if (!allTables) throw new Error("No token tables generated");
      return [{ type: "html", value: allTables }];
    }

    const tokenPath = `/${groups[0]}.json`;
    const data = tokenData.get(tokenPath);
    if (!data) throw new Error(`Token file not found: ${tokenPath}`);

    const tableMarkdown = generateMarkdownTable(data.data.tokens, groups);
    if (!tableMarkdown) throw new Error(`No table generated for groups: ${groups.join(".")}`);

    return [{ type: "html", value: tableMarkdown }];
  },
};
