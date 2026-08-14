import type {
  MdxJsxAttribute,
  MdxJsxAttributeValueExpression,
  MdxJsxFlowElement,
} from "mdast-util-mdx-jsx";
import { match, P } from "ts-pattern";
import type { Exchange } from "@seed-design/rootage-core";
import color from "@seed-design/rootage-artifacts/color";
import dimension from "@seed-design/rootage-artifacts/dimension";
import duration from "@seed-design/rootage-artifacts/duration";
import fontSize from "@seed-design/rootage-artifacts/font-size";
import fontWeight from "@seed-design/rootage-artifacts/font-weight";
import gradient from "@seed-design/rootage-artifacts/gradient";
import lineHeight from "@seed-design/rootage-artifacts/line-height";
import radius from "@seed-design/rootage-artifacts/radius";
import scale from "@seed-design/rootage-artifacts/scale";
import shadow from "@seed-design/rootage-artifacts/shadow";
import timingFunction from "@seed-design/rootage-artifacts/timing-function";
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
  fumadocs processed text에서 HTML entity로 escape된 문자열을 디코딩합니다.
  예: `[&#x22;color&#x22;, &#x22;palette&#x22;]` → `["color", "palette"]`
*/
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#x22;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

/*
  <TokenReference groups={["color", "palette"]} /> 에서 groups 배열을 파싱합니다.
  fumadocs processed text에서 속성이 HTML-escaped string으로 변환된 경우도 처리합니다.
*/
function getGroupsFromNode(node: MdxJsxFlowElement): string[] {
  const attr = node.attributes.find(
    (a): a is MdxJsxAttribute => a.type === "mdxJsxAttribute" && a.name === "groups",
  );
  if (!attr) return [];

  // fumadocs processed text: groups="[&#x22;color&#x22;, &#x22;palette&#x22;]"
  if (typeof attr.value === "string") {
    try {
      const decoded = decodeHtmlEntities(attr.value);
      const parsed: unknown = JSON.parse(decoded);
      if (Array.isArray(parsed)) return parsed.filter((v): v is string => typeof v === "string");
    } catch {
      // JSON 파싱 실패 시 빈 배열 반환
    }
    return [];
  }

  if (typeof attr.value !== "object" || !attr.value) return [];

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
  fumadocs processed text에서 속성이 HTML-escaped string으로 변환된 경우도 처리합니다.
*/
function getRegexFromNode(node: MdxJsxFlowElement): RegExp | null {
  const attr = node.attributes.find(
    (a): a is MdxJsxAttribute => a.type === "mdxJsxAttribute" && a.name === "regex",
  );
  if (!attr) return null;

  // fumadocs processed text: regex="/\$color\..*-pressed$/"
  if (typeof attr.value === "string") {
    const decoded = decodeHtmlEntities(attr.value);
    const match = decoded.match(/^\/(.+)\/([dgimsuvy]*)$/);
    if (match) {
      try {
        return new RegExp(match[1], match[2]);
      } catch {
        return null;
      }
    }
    return null;
  }

  if (typeof attr.value !== "object" || !attr.value) return null;

  const attrValue = attr.value as MdxJsxAttributeValueExpression;
  const estree = attrValue.data?.estree;
  if (!isProgramNode(estree)) return null;

  const stmt = estree.body[0];
  if (!stmt || stmt.type !== "ExpressionStatement") return null;

  const expr = (stmt as ExpressionStatementNode).expression;
  if (!isRegexLiteral(expr)) return null;

  return new RegExp(expr.regex.pattern, expr.regex.flags);
}

/*
  토큰 값을 사람이 읽을 수 있는 문자열로 변환합니다.
*/
export type ArtifactValue =
  | Exclude<Exchange.Value, Exchange.Gradient | Exchange.Shadow>
  | { type: "gradient"; value: readonly Exchange.GradientStop[] | Exchange.TokenRef }
  | { type: "shadow"; value: readonly Exchange.ShadowLayer[] | Exchange.TokenRef };

export type ArtifactTokensModel = {
  kind: "Tokens";
  metadata: Exchange.TokensModel["metadata"];
  data: {
    collection: string;
    tokens: Record<
      Exchange.TokenRef,
      { values: Record<string, ArtifactValue>; description?: string }
    >;
  };
};

export function formatTokenValue(entry: ArtifactValue): string {
  return (
    match(entry)
      .with({ type: "number" }, ({ value }) => String(value))
      .with(
        { type: "dimension", value: { unit: "rem" } },
        ({ value }) => `${value.value}rem (${Math.round(value.value * 16)}px)`,
      )
      .with({ type: "dimension", value: { unit: "px" } }, ({ value }) => `${value.value}px`)
      .with(
        { type: "duration", value: { unit: P.union("ms", "s") } },
        ({ value }) => `${value.value}${value.unit}`,
      )
      .with(
        { type: "cubicBezier", value: P.array(P.number) },
        ({ value }) => `cubic-bezier(${value.join(", ")})`,
      )
      .with({ type: P.union("shadow", "gradient"), value: P.array() }, ({ value }) =>
        JSON.stringify(value),
      )
      // 남은 건 전부 문자열 그대로 출력한다 — TokenRef, ColorLit, enum 값.
      .with({ value: P.string }, ({ value }) => value)
      .exhaustive()
  );
}

/*
  rootage 토큰 데이터에서 마크다운 테이블을 생성합니다.
  groups가 ["radius"]이면 "$radius." 로 시작하는 토큰만 포함합니다.
*/
export function generateMarkdownTable(
  tokens: ArtifactTokensModel["data"]["tokens"],
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
  TokenReference에서 사용하는 모든 rootage 토큰 데이터를 정적으로 포함합니다.
  Turbopack이 런타임 파일 탐색 없이 의존성을 추적할 수 있습니다.
*/
const tokenData = [
  color,
  dimension,
  duration,
  fontSize,
  fontWeight,
  gradient,
  lineHeight,
  radius,
  scale,
  shadow,
  timingFunction,
] satisfies readonly ArtifactTokensModel[];

export const tokenReferenceRule: Rule<MdxJsxFlowElement> = {
  name: "TokenReference",
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "TokenReference",
  transform: (node) => {
    const regex = getRegexFromNode(node);
    const groups = getGroupsFromNode(node);

    if (regex) {
      const matched: { id: string; entry: { values: Record<string, ArtifactValue> } }[] = [];
      for (const data of tokenData) {
        for (const [id, entry] of Object.entries(data.data.tokens)) {
          regex.lastIndex = 0;
          if (regex.test(id)) matched.push({ id, entry });
        }
      }

      if (matched.length === 0) return [node];

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
      for (const data of tokenData) {
        const table = generateMarkdownTable(data.data.tokens, [data.metadata.id]);
        if (table) sections.push(`## ${data.metadata.name}\n\n${table}`);
      }
      const allTables = sections.join("\n\n");
      if (!allTables) return [node];
      return [{ type: "html", value: allTables }];
    }

    const data = tokenData.find(({ metadata }) => metadata.id === groups[0]);
    if (!data) return [node];

    const tableMarkdown = generateMarkdownTable(data.data.tokens, groups);
    if (!tableMarkdown) return [node];

    return [{ type: "html", value: tableMarkdown }];
  },
};
