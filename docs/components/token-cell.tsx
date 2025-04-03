import IconArrowDownLine from "@karrotmarket/react-monochrome-icon/IconArrowDownLine";
import type { AST } from "@seed-design/rootage-core";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Fragment } from "react";
import { TokenLink } from "./token-link";
import { TypeIndicator } from "./type-indicator";

export interface TokenCellProps {
  isExpanded: boolean;
  values: string[];
  resolvedValue: AST.ValueLit;
}

export function TokenCell(props: TokenCellProps) {
  const { isExpanded, values, resolvedValue } = props;

  return (
    <div className="flex justify-between" aria-expanded={isExpanded}>
      <div className="flex flex-col gap-1">
        {isExpanded ? (
          values.map((value, index) => (
            <Fragment key={value}>
              <div className="flex items-center gap-2">
                <TypeIndicator value={resolvedValue} />{" "}
                {value.startsWith("$") ? <TokenLink id={value} /> : value}
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
            {values[0].startsWith("$") ? <TokenLink id={values[0]} /> : values[0]}
          </div>
        )}
      </div>
      {values.length > 1 ? (
        <div className="flex h-6 items-center">
          {isExpanded ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </div>
      ) : null}
    </div>
  );
}
