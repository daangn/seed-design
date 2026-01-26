import {
  IconArrowDownLine,
  IconChevronDownLine,
  IconChevronUpLine,
} from "@karrotmarket/react-monochrome-icon";
import type { AST } from "@seed-design/rootage-core";
import { Fragment } from "react";
import { TokenLink } from "./token-link";
import { TypeIndicator } from "./type-indicator";

export interface TokenValue {
  ref: string;
  description?: string;
}

export interface TokenCellProps {
  isExpanded: boolean;
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

export function TokenCell(props: TokenCellProps) {
  const { isExpanded, values, resolvedValue } = props;

  const isGradientWithTokens =
    resolvedValue.kind === "GradientLit" &&
    resolvedValue.stops.some((stop) => stop.color.kind === "TokenLit");

  return (
    <div className="flex justify-between" aria-expanded={isExpanded}>
      <div className="flex flex-col gap-1">
        {isExpanded ? (
          values.map((item, index) => (
            <Fragment key={item.ref}>
              <div className="flex items-center gap-2">
                <TypeIndicator value={resolvedValue} />{" "}
                {index === values.length - 1 && isGradientWithTokens ? (
                  renderGradientWithTokens(resolvedValue as AST.GradientLit)
                ) : item.ref.startsWith("$") ? (
                  <TokenLink id={item.ref} description={item.description} />
                ) : (
                  item.ref
                )}
              </div>
              {index < values.length - 1 ? (
                <div className="flex w-4 h-4 items-center justify-center">
                  <IconArrowDownLine className="w-3 h-3" />
                </div>
              ) : null}
            </Fragment>
          ))
        ) : (
          <div className="flex items-center gap-2">
            <TypeIndicator value={resolvedValue} />{" "}
            {isGradientWithTokens ? (
              renderGradientWithTokens(resolvedValue as AST.GradientLit)
            ) : values[0].ref.startsWith("$") ? (
              <TokenLink id={values[0].ref} description={values[0].description} />
            ) : (
              values[0].ref
            )}
          </div>
        )}
      </div>
      {values.length > 1 ? (
        <div className="flex h-6 items-center gap-0.5">
          {isExpanded ? (
            <IconChevronUpLine className="w-4 h-4" />
          ) : (
            <IconChevronDownLine className="w-4 h-4" />
          )}
        </div>
      ) : null}
    </div>
  );
}
