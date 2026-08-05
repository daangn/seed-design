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
import type { Exchange } from "@seed-design/rootage-core";
import type { MdxJsxAttribute } from "mdast-util-mdx-jsx";
import { match, P } from "ts-pattern";
import {
  type ArrayExpressionNode,
  type ExpressionStatementNode,
  type LiteralNode,
  isProgramNode,
  isRegexLiteral,
  isStringLiteral,
} from "../estree";
import { markdownRow } from "../markdown-table";
import type { JsxNode, LLMHandler } from "../types";

/**
 * The artifacts widen `gradient`/`shadow` beyond `Exchange.Value`: a token may hold either
 * the resolved stops/layers or a reference to another token.
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

type TokenEntry = ArtifactTokensModel["data"]["tokens"][Exchange.TokenRef];

function findAttribute(node: JsxNode, name: string) {
  return node.attributes.find(
    (attribute): attribute is MdxJsxAttribute =>
      attribute.type === "mdxJsxAttribute" && attribute.name === name,
  );
}

/*
  <TokenReference groups={["color", "palette"]} /> 에서 groups 배열을 파싱합니다.
  문자열로 쓴 속성(groups="[...]")도 JSON 배열로 받습니다.
*/
function readGroups(node: JsxNode): string[] {
  const attr = findAttribute(node, "groups");
  if (!attr?.value) return [];

  if (typeof attr.value === "string") {
    try {
      const parsed: unknown = JSON.parse(attr.value);
      if (Array.isArray(parsed)) return parsed.filter((v): v is string => typeof v === "string");
    } catch {
      // JSON 파싱 실패 시 빈 배열 반환
    }

    return [];
  }

  const estree = attr.value.data?.estree;
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
  문자열로 쓴 속성(regex="/.../")도 정규식 리터럴로 받습니다.
*/
function readRegex(node: JsxNode): RegExp | null {
  const attr = findAttribute(node, "regex");
  if (!attr?.value) return null;

  if (typeof attr.value === "string") {
    const literal = attr.value.match(/^\/(.+)\/([dgimsuvy]*)$/);
    if (!literal) return null;

    try {
      return new RegExp(literal[1], literal[2]);
    } catch {
      return null;
    }
  }

  const estree = attr.value.data?.estree;
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

function buildTable(entries: [string, TokenEntry][]): string {
  if (entries.length === 0) return "";

  // 첫 번째 토큰에서 theme(column) 이름 결정
  const themeNames = Object.keys(entries[0][1].values);
  const headers = ["Token", ...themeNames];

  const rows = entries.map(([id, entry]) =>
    markdownRow([
      id,
      ...themeNames.map((theme) => {
        const value = entry.values[theme];
        return value ? formatTokenValue(value) : "";
      }),
    ]),
  );

  return [markdownRow(headers), markdownRow(headers.map(() => "---")), ...rows].join("\n");
}

/** groups가 ["radius"]이면 "$radius." 로 시작하는 토큰만 포함합니다. */
const tableForGroups = (tokens: ArtifactTokensModel["data"]["tokens"], groups: string[]) =>
  buildTable(Object.entries(tokens).filter(([id]) => id.startsWith(`$${groups.join(".")}.`)));

/**
 * `<TokenReference />`를 rootage 토큰 표로 바꾼다. `regex`가 있으면 모든 컬렉션에서
 * id로 걸러내고, `groups`가 있으면 그 접두사의 토큰만, 둘 다 없으면 컬렉션마다
 * `## 이름` 절을 붙여 전부 내보낸다.
 *
 * 표가 비면 태그를 그대로 남긴다 — 토큰 데이터를 못 읽었을 때 본문에서 이 자리가
 * 통째로 사라지는 것보다 낫다.
 *
 * 참조할 아티팩트를 인자로 받는다. 테스트는 합성 아티팩트로 핸들러를 만들어 실제 토큰
 * 값에 묶이지 않게 한다.
 */
export function createTokenReferenceHandler(
  tokenData: readonly ArtifactTokensModel[],
): LLMHandler {
  return {
    names: ["TokenReference"],
    render: (node) => {
      const regex = readRegex(node);

      if (regex) {
        const matched = tokenData.flatMap((data) =>
          Object.entries(data.data.tokens).filter(([id]) => {
            regex.lastIndex = 0;
            return regex.test(id);
          }),
        );

        return buildTable(matched) || undefined;
      }

      const groups = readGroups(node);

      if (groups.length === 0) {
        return (
          tokenData
            .map((data) => ({
              name: data.metadata.name,
              table: tableForGroups(data.data.tokens, [data.metadata.id]),
            }))
            .filter(({ table }) => table)
            .map(({ name, table }) => `## ${name}\n\n${table}`)
            .join("\n\n") || undefined
        );
      }

      const data = tokenData.find(({ metadata }) => metadata.id === groups[0]);
      if (!data) return undefined;

      return tableForGroups(data.data.tokens, groups) || undefined;
    },
  };
}

/*
  TokenReference에서 사용하는 모든 rootage 토큰 데이터를 정적으로 포함합니다.
  Turbopack이 런타임 파일 탐색 없이 의존성을 추적할 수 있습니다.
*/
export const tokenReferenceHandler = createTokenReferenceHandler([
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
]);
