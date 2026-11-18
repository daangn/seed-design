import {
  IconArrowDownLine,
  IconChevronDownLine,
  IconChevronUpLine,
} from "@karrotmarket/react-monochrome-icon";
import type { AST } from "@seed-design/rootage-core";
import { Fragment } from "react";
import { CopyValue } from "./copy-value";
import { TokenLink } from "./token-link";
import { TypeIndicator } from "./type-indicator";

export interface TokenValue {
  ref: string;
  description?: string;
}

/**
 * 값이 둘 이상이면 접힌(최종 값)·펼친(해결 경로 전체) 마크업을 둘 다 그린다. 어느 쪽을 보일지는 가장 가까운
 * `group/expand` 조상의 `data-expanded`(`expand` widget, `src/mdx/widgets.ts`)가 CSS로 정한다.
 */
export interface TokenCellProps {
  values: TokenValue[];
  resolvedValue: AST.ValueLit;
}

function renderGradientWithTokens(gradient: AST.GradientLit) {
  return (
    <span>
      {gradient.stops.map((stop, index) => (
        <Fragment key={index}>
          {stop.color.kind === "TokenLit" ? (
            <TokenLink id={stop.color.identifier} />
          ) : (
            stop.color.value
          )}{" "}
          {(stop.position.value * 100).toFixed(1)}%{index < gradient.stops.length - 1 ? ", " : ""}
        </Fragment>
      ))}
    </span>
  );
}

function renderShadowWithTokens(shadow: AST.ShadowLit) {
  return (
    <span>
      {shadow.layers.map((layer, index) => (
        <Fragment key={index}>
          {layer.offsetX.value}
          {layer.offsetX.unit} {layer.offsetY.value}
          {layer.offsetY.unit} {layer.blur.value}
          {layer.blur.unit} {layer.spread.value}
          {layer.spread.unit}{" "}
          {layer.color.kind === "TokenLit" ? (
            <TokenLink id={layer.color.identifier} />
          ) : (
            layer.color.value
          )}
          {index < shadow.layers.length - 1 ? ", " : ""}
        </Fragment>
      ))}
    </span>
  );
}

export function TokenCell(props: TokenCellProps) {
  const { values, resolvedValue } = props;
  const canExpand = values.length > 1;

  const isGradientWithTokens =
    resolvedValue.kind === "GradientLit" &&
    resolvedValue.stops.some((stop) => stop.color.kind === "TokenLit");

  const isShadowWithTokens =
    resolvedValue.kind === "ShadowLit" &&
    resolvedValue.layers.some((layer) => layer.color.kind === "TokenLit");

  // 토큰이 든 gradient·shadow는 접힌 상태에서 첫 단계 대신 최종 값을 펼쳐 보인다. 그 밖에는 접힌 상태가 해결 경로의
  // 첫 단계와 같으므로 경로를 한 번만 그리고 둘째 단계부터 접힌 상태에서 숨긴다(정적 HTML 중복을 줄인다).
  const hasCollapsedValue = isGradientWithTokens || isShadowWithTokens;
  const expandedOnly = "hidden group-data-expanded/expand:flex";

  return (
    <div className="flex justify-between" data-token-cell="" aria-expanded={false}>
      <div className="flex flex-col gap-1">
        {hasCollapsedValue ? (
          <div
            className={`flex items-center gap-2 ${canExpand ? "group-data-expanded/expand:hidden" : ""}`}
          >
            <TypeIndicator value={resolvedValue} />{" "}
            {isShadowWithTokens
              ? renderShadowWithTokens(resolvedValue as AST.ShadowLit)
              : renderGradientWithTokens(resolvedValue as AST.GradientLit)}
          </div>
        ) : null}
        {canExpand || !hasCollapsedValue
          ? values.map((item, index) => (
              <Fragment key={item.ref}>
                <div
                  className={`items-center gap-2 ${index === 0 && !hasCollapsedValue ? "flex" : expandedOnly}`}
                >
                  <TypeIndicator value={resolvedValue} />{" "}
                  {index === values.length - 1 && isShadowWithTokens ? (
                    renderShadowWithTokens(resolvedValue as AST.ShadowLit)
                  ) : index === values.length - 1 && isGradientWithTokens ? (
                    renderGradientWithTokens(resolvedValue as AST.GradientLit)
                  ) : item.ref.startsWith("$") ? (
                    <TokenLink id={item.ref} description={item.description} />
                  ) : (
                    <CopyValue value={item.ref} />
                  )}
                </div>
                {index < values.length - 1 ? (
                  <div className={`w-4 h-4 items-center justify-center ${expandedOnly}`}>
                    <IconArrowDownLine className="w-3 h-3" />
                  </div>
                ) : null}
              </Fragment>
            ))
          : null}
      </div>
      {canExpand ? (
        <div className="flex h-6 items-center gap-0.5">
          <IconChevronUpLine className="w-4 h-4 hidden group-data-expanded/expand:block" />
          <IconChevronDownLine className="w-4 h-4 group-data-expanded/expand:hidden" />
        </div>
      ) : null}
    </div>
  );
}
